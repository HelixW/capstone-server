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
import * as speakeasy from 'speakeasy';
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
      token: this.jwtService.sign({
        id: user.id,
        access: res.access,
        admin: false,
      }),
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
      token: this.jwtService.sign({
        id: res.id,
        access: res.access,
        admin: false,
      }),
    };
  }

  async validate(): Promise<ValidateDto> {
    return {
      message: 'User authenticated.',
    };
  }

  async validateAccess(req): Promise<ValidateDto> {
    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken.access !== 1)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    return {
      message: 'User authorised.',
    };
  }

  async validateAdmin(req): Promise<ValidateDto> {
    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken.admin !== true)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    return {
      message: 'User authorised.',
    };
  }

  async twoFa(req): Promise<TwoFADto> {
    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken.access !== 1)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    const secret = await speakeasy.generateSecret({ name: 'Decentralised FS' });
    const qr = await qrcode.toDataURL(secret.otpauth_url);

    await this.userModel
      .findOneAndUpdate({ id: decodedToken.id }, { secret: secret.base32 })
      .exec();

    return {
      message: 'User authorised.',
      qr,
    };
  }

  async twoFaVerify(req): Promise<UserDto> {
    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken.access !== 1)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    // Fetch temporary secret from user
    const res = await this.userModel.findOne({ id: decodedToken.id }).exec();

    const base32Secret = res.secret;

    // Check if TOTP provided is valid
    const userToken = req.body.totp;

    const verified = speakeasy.totp.verify({
      secret: base32Secret,
      encoding: 'base32',
      token: userToken,
      window: 1,
    });

    if (!verified) throw new UnauthorizedException('Invalid token provided.');

    return {
      message: 'User registered.',
      token: this.jwtService.sign({
        id: decodedToken.id,
        access: decodedToken.access,
        admin: true,
      }),
    };
  }
}
