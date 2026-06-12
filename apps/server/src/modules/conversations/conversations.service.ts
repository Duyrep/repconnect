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
import { ConversationType } from '@/common/enums';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const { type, participants } = createConversationDto;

    if (
      (type === ConversationType.INDIVIDUAL && participants.length !== 2) ||
      (type === ConversationType.INDIVIDUAL &&
        (await this.existIndividual(participants[0], participants[1])))
    )
      throw new BadRequestException();

    return await this.conversationModel.create({ type, participants });
  }

  async findByUserId(userId: string) {
    return (
      await this.conversationModel
        .find({ participants: userId })
        .populate({ path: 'participants', select: '_id username displayName' })
        .sort({ updateAt: -1 })
        .lean<
          ({
            participants: {
              _id: string;
              username: string;
              displayName: string;
            }[];
          } & Conversation)[]
        >()
    ).map(({ _id, participants, type, createdAt, updatedAt }) => ({
      id: _id,
      participants:
        type === ConversationType.INDIVIDUAL
          ? participants.filter(({ _id }) => _id !== userId)
          : participants,
      type,
      createdAt,
      updatedAt,
    }));
  }

  async findIndividual(userId1: string, userId2: string) {
    const conversation = await this.conversationModel
      .findOne({
        type: ConversationType.INDIVIDUAL,
        participants: { $all: [userId1, userId2], $size: 2 },
      })
      .exec();

    if (conversation) return conversation;

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
      .populate({ path: 'participants', select: 'username displayName' })
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
    return conversation;
  }

  update(id: string, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: string) {
    return `This action removes a #${id} conversation`;
  }

  async getConversationForUser(userId, conversationId: string) {
    const conversation = await this.findOne(conversationId);

    if (!conversation.participants.some((v) => v._id === userId))
      throw new ForbiddenException('Forbidden');

    return conversation;
  }
}
