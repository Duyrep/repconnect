import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async exists(filter: Partial<User>) {
    return !!(await this.userModel.exists(filter));
  }

  async incrementTokenVersion(id: string) {
    await this.userModel.updateOne({ _id: id }, { $inc: { token_version: 1 } });
  }

  async findOne(filter: Record<string, string>) {
    return await this.userModel.findOne(filter);
  }

  async findOneById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }
}
