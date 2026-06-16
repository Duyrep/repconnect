import { Module } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { FriendshipController } from './friendships.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendShip, FriendShipSchema } from './schemas/friendship.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendShip.name, schema: FriendShipSchema },
    ]),
  ],
  controllers: [FriendshipController],
  providers: [FriendshipsService],
  exports: [FriendshipsService, MongooseModule],
})
export class FriendshipsModule {}
