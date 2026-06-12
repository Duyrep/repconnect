import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendShip } from './schemas/friendship.schema';
import { Model } from 'mongoose';
import { FriendShipStatus } from '@/common/enums';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectModel(FriendShip.name)
    private readonly friendshipModel: Model<FriendShip>,
  ) {}

  async request(requesterId: string, recipientId: string) {
    if (
      requesterId === recipientId ||
      (await this.existsBetween(requesterId, recipientId))
    )
      throw new BadRequestException();
    await this.friendshipModel.create({ requesterId, recipientId });
  }

  async accept(requesterId: string, recipientId: string) {
    const result = await this.friendshipModel.updateOne(
      { requesterId, recipientId, status: FriendShipStatus.PENDING },
      { status: FriendShipStatus.ACCEPTED },
    );

    if (result.matchedCount === 0) throw new BadRequestException();
  }

  async decline(requesterId: string, recipientId: string) {
    const result = await this.friendshipModel.updateOne(
      { requesterId, recipientId, status: FriendShipStatus.PENDING },
      { status: FriendShipStatus.DECLINE },
    );
    if (result.matchedCount === 0) throw new BadRequestException();
  }

  async block(currentUserId: string, targetUserId: string) {
    const existing = await this.friendshipModel.findOne({
      $or: [
        { requesterId: currentUserId, recipientId: targetUserId },
        { requesterId: targetUserId, recipientId: currentUserId },
      ],
    });

    if (!existing) {
      await this.friendshipModel.create({
        requesterId: currentUserId,
        recipientId: targetUserId,
        status: FriendShipStatus.BLOCKED,
      });
    } else {
      existing.requesterId = currentUserId;
      existing.recipientId = targetUserId;
      existing.status = FriendShipStatus.BLOCKED;
      await existing.save(); // Lưu lại thay đổi
    }
  }

  async cancel(requesterId: string, recipientId: string) {
    if (!(await this.existsByRequesterId(requesterId)))
      throw new NotFoundException();
    await this.friendshipModel.deleteOne({ requesterId, recipientId });
  }

  async findOneById(id: string) {
    return await this.friendshipModel.findOne({ _id: id });
  }

  async getPendingRequests(userId: string) {
    return (
      await this.friendshipModel
        .find({
          $or: [
            { requesterId: userId, status: FriendShipStatus.PENDING },
            { recipientId: userId, status: FriendShipStatus.PENDING },
          ],
        })
        .populate({
          path: 'requesterId',
          select: 'username displayName avatarUrl',
        })
        .populate({
          path: 'recipientId',
          select: 'username displayName avatarUrl',
        })
        .limit(10)
        .lean<
          (FriendShip & {
            requesterId: {
              _id: string;
              displayName: string;
              username: string;
            };
            recipientId: {
              _id: string;
              displayName: string;
              username: string;
            };
          })[]
        >()
    ).map(({ requesterId, recipientId, status, createdAt }) => ({
      requester: {
        id: requesterId._id,
        displayName: requesterId.displayName,
        username: requesterId.username,
      },
      recipient: {
        id: recipientId._id,
        displayName: recipientId.displayName,
        username: recipientId.username,
      },
      status,
      createdAt,
    }));
  }

  async getFriends(userId: string) {
    return (
      await this.friendshipModel
        .find({
          $or: [
            { requesterId: userId, status: FriendShipStatus.ACCEPTED },
            { recipientId: userId, status: FriendShipStatus.ACCEPTED },
          ],
        })
        .populate({
          path: 'requesterId',
          select: 'username displayName avatarUrl',
        })
        .populate({
          path: 'recipientId',
          select: 'username displayName avatarUrl',
        })
        .limit(10)
        .lean<
          (FriendShip & {
            requesterId: {
              _id: string;
              displayName: string;
              username: string;
            };
            recipientId: {
              _id: string;
              displayName: string;
              username: string;
            };
          })[]
        >()
    ).map(({ requesterId, recipientId, createdAt }) => ({
      id: requesterId._id === userId ? recipientId._id : requesterId._id,
      username:
        requesterId._id === userId
          ? recipientId.username
          : requesterId.username,
      displayName:
        requesterId._id === userId
          ? recipientId.displayName
          : requesterId.displayName,
      createdAt,
    }));
  }

  async findByBetween(requesterId: string, recipientId: string) {
    return await this.friendshipModel.findOne({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId },
      ],
    });
  }

  async existById(id: string) {
    return !!(await this.friendshipModel.exists({ _id: id }));
  }

  async existsByRequesterId(requesterId: string) {
    return !!(await this.friendshipModel.exists({ requesterId }));
  }

  async existsBetween(requesterId: string, recipientId: string) {
    return !!(await this.friendshipModel.exists({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId },
      ],
    }));
  }
}
