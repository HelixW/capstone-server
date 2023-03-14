import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatedUserDto, ExistsDto, RegisterDto } from 'src/dto/auth.dto';
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
    type: ExistsDto,
  })
  @Post('register')
  register(@Req() req): CreatedUserDto {
    return this.authService.register(req.body);
  }
}
