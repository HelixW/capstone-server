import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreatedUserDto } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, // @InjectModel(User.email) private userModel: Model<UserDocument>,
  ) {}

  register(req): CreatedUserDto {
    const user = req;

    // Add unique ID to user
    user.id = uuidv4();

    return {
      message: 'User registered.',
      token: this.jwtService.sign({ id: user.id, access: 2 }),
    };
  }

  // async login(user: any): Promise<any> {
  //   return {
  //     access_token: this.jwtService.sign({ user: user, sub: 1 }),
  //   };
  // }
}
