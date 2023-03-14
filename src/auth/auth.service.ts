import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreatedUserDto } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(req): Promise<CreatedUserDto> {
    const user = req;

    // Add unique ID to user
    user.id = uuidv4();

    // Check if user already exists in database else, create user
    let res = await this.userModel.findOne({ email: user.email }).exec();
    if (res !== null) throw new BadRequestException('User already exists.');
    else res = await this.userModel.create(user);

    console.log(res);
    return {
      message: 'User registered.',
      token: this.jwtService.sign({ id: user.id, access: res.access }),
    };
  }
}
