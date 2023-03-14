import { Controller, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto, RegisterDto, LoginDto } from 'src/dto/auth.dto';
import { ExceptionDto } from 'src/dto/exception.dto';
import { AuthService } from './auth.service';

@Controller('identity')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Authentication')
  @ApiBody({ description: 'Register a new user.', type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User is successfully created.',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User already exists.',
    type: ExceptionDto,
  })
  @Post('register')
  async register(@Req() req): Promise<UserDto> {
    return this.authService.register(req.body);
  }

  @ApiTags('Authentication')
  @ApiBody({ description: 'Login with an existing user.', type: LoginDto })
  @ApiCreatedResponse({
    description: 'User is successfully logged in.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials provided or user does not exist.',
    type: ExceptionDto,
  })
  @Post('login')
  login(@Req() req): Promise<UserDto> {
    return this.authService.login(req.body);
  }
}
