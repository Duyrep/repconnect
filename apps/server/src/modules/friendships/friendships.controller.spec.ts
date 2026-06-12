import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';

describe('FriendshipController', () => {
  let controller: FriendshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipController],
      providers: [FriendshipsService],
    }).compile();

    controller = module.get<FriendshipController>(FriendshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
