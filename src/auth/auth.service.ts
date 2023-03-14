import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) // @InjectModel(User.email) private userModel: Model<UserDocument>,
  {}

  async register(): Promise<any> {
    return { message: '/auth/register hit' };
  }

  async login(user: any): Promise<any> {
    return {
      access_token: this.jwtService.sign({ user: user, sub: 1 }),
    };
  }
}
