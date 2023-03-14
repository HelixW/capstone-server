import { Controller, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatedUserDto, RegisterDto } from 'src/dto/auth.dto';
import { ExceptionDto } from 'src/dto/exception.dto';
import { AuthService } from './auth.service';

@Controller('identity')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Register User')
  @ApiBody({ description: 'User fields sent by client.', type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User is successfully created.',
    type: CreatedUserDto,
  })
  @ApiBadRequestResponse({
    description: 'User already exists.',
    type: ExceptionDto,
  })
  @Post('register')
  async register(@Req() req): Promise<CreatedUserDto> {
    return this.authService.register(req.body);
  }
}
