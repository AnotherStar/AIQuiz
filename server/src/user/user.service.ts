import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService implements OnApplicationBootstrap {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async onApplicationBootstrap() {}

    async createUser(username: string) {
        return this.userModel.create({ username });
    }
}
