import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { TwoFADto, UserDto, ValidateDto } from 'src/dto/auth.dto';
import { hash as createHash, genSalt, compare } from 'bcrypt';
import { generateSecret } from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(req): Promise<UserDto> {
    const user = req;

    // Add unique ID to user
    user.id = uuidv4();

    // Salt and hash strategy
    const saltRounds = 10;
    const salt: string = await genSalt(saltRounds);
    const hash: string = await createHash(user.password, salt);
    user.password = hash;

    // Check if user already exists in database else, create user
    let res = await this.userModel.findOne({ email: user.email }).exec();
    if (res !== null) throw new BadRequestException('User already exists.');
    else {
      res = await this.userModel.create(user);
    }

    return {
      message: 'User registered.',
      token: this.jwtService.sign({ id: user.id, access: res.access }),
    };
  }

  async login(req): Promise<UserDto> {
    const user = req;

    // Check if user is registered
    const res = await this.userModel.findOne({ email: user.email }).exec();
    if (res === null)
      throw new UnauthorizedException('User is not registered.');

    // Check password
    const valid = await compare(user.password, res.password);

    if (!valid) throw new UnauthorizedException('Invalid email or password.');

    return {
      message: 'Login successful.',
      token: this.jwtService.sign({ id: res.id, access: res.access }),
    };
  }

  async validate(): Promise<ValidateDto> {
    return {
      message: 'User authenticated.',
    };
  }

  async twofa(req): Promise<TwoFADto> {
    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken.access !== 1)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    // Generate QR Code
    let qr = '';

    const secret = await generateSecret({ name: 'Decentralised FS' });
    await qrcode.toDataURL(secret.otpauth_url, (err, data) => {
      if (err) {
        console.log(err);
        throw new UnauthorizedException('QR code could not be generated.');
      }

      qr = data;
    });

    return {
      message: 'User authorised.',
      qr,
    };
  }
}
