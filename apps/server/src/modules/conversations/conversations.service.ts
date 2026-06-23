import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Model } from 'mongoose';
import { ConversationType, FriendShipStatus } from '@/common/enums';
import { FriendshipsService } from '../friendships/friendships.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    private readonly friendshipsService: FriendshipsService,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const { type, participants } = createConversationDto;

    if (
      (type === ConversationType.INDIVIDUAL && participants.length !== 2) ||
      (type === ConversationType.INDIVIDUAL &&
        (await this.existIndividual(participants[0], participants[1])))
    )
      throw new BadRequestException();

    if (type === ConversationType.INDIVIDUAL) {
      const [participant1, participant2] = participants;

      const friendship = await this.friendshipsService.findByBetween(
        participant1,
        participant2,
      );

      if (!friendship || friendship.status !== FriendShipStatus.ACCEPTED)
        throw new BadRequestException();

      return await this.conversationModel.create({
        type,
        participants,
        friendship: friendship._id,
      });
    } else return await this.conversationModel.create({ type, participants });
  }

  async findByUserId(userId: string) {
    const conversations = await this.conversationModel
      .find({ participants: userId })
      .populate({ path: 'participants', select: '_id username displayName' })
      .populate({ path: 'friendship', select: '_id status' })
      .sort({ updateAt: -1 })
      .lean<
        {
          _id: string;
          type: ConversationType;
          name: string;
          participants: {
            _id: string;
            username: string;
            displayName: string;
          }[];
          friendship?: { _id: string; status: FriendShipStatus };
          createdAt: Date;
          updatedAt: Date;
        }[]
      >();

    return conversations
      .map(({ _id, participants, type, friendship, createdAt, updatedAt }) => {
        if (!friendship || friendship.status !== FriendShipStatus.ACCEPTED)
          return false;

        return {
          id: _id,
          participants:
            type === ConversationType.INDIVIDUAL
              ? participants.filter(({ _id }) => _id !== userId)
              : participants,
          type,
          createdAt,
          updatedAt,
        };
      })
      .filter((v) => v);
  }

  async findIndividual(userId1: string, userId2: string) {
    const conversation = await this.conversationModel
      .findOne({
        type: ConversationType.INDIVIDUAL,
        participants: { $all: [userId1, userId2], $size: 2 },
      })
      .lean<{
        _id: string;
        type: ConversationType;
        name: string;
        participants: {
          _id: string;
          username: string;
          displayName: string;
        }[];
        friendship?: { _id: string; status: FriendShipStatus };
        createdAt: Date;
        updatedAt: Date;
      }>()
      .exec();

    if (conversation)
      return {
        ...conversation,
        id: conversation._id,
        participants: conversation.participants.map(
          ({ _id, username, displayName }) => ({
            id: _id,
            username,
            displayName,
          }),
        ),
      };

    return await this.create({
      type: ConversationType.INDIVIDUAL,
      participants: [userId1, userId2],
    });
  }

  async existIndividual(userId1: string, userId2: string) {
    return !!(await this.conversationModel
      .exists({
        type: ConversationType.INDIVIDUAL,
        participants: { $all: [userId1, userId2], $size: 2 },
      })
      .exec());
  }

  async exist(id: string) {
    return !!(await this.conversationModel
      .exists({
        _id: id,
      })
      .exec());
  }

  findAll() {
    return `This action returns all conversations`;
  }

  async findOne(id: string) {
    const conversation = await this.conversationModel
      .findOne({ _id: id })
      .populate({ path: 'participants', select: '_id username displayName' })
      .lean<{
        _id: string;
        type: ConversationType;
        name?: string;
        participants: { _id: string; username: string; displayName: string }[];
        createdAt: Date;
        updatedAt: Date;
      }>()
      .exec();

    if (!conversation) throw new NotFoundException();
    return {
      id: conversation._id,
      type: conversation.type,
      name: conversation.name,
      participants: conversation.participants.map(
        ({ _id, username, displayName }) => ({
          id: _id,
          username,
          displayName,
        }),
      ),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  update(id: string, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: string) {
    return `This action removes a #${id} conversation`;
  }

  async getConversationForUser(userId, conversationId: string) {
    const conversation = await this.findOne(conversationId);

    if (!conversation.participants.some((v) => v.id === userId))
      throw new ForbiddenException();

    if (conversation.type === ConversationType.INDIVIDUAL) {
      const [user1, user2] = conversation.participants;
      if (!(await this.friendshipsService.existsBetween(user1.id, user2.id)))
        throw new NotFoundException();
    }

    return conversation;
  }
}
