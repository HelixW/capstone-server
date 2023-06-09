import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UserDto,
  RegisterDto,
  LoginDto,
  ValidateDto,
  TwoFADto,
  TOTPDto,
} from 'src/dto/auth.dto';
import { ExceptionDto } from 'src/dto/exception.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

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
  @ApiOkResponse({
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

  @ApiBearerAuth()
  @ApiTags('Authentication')
  @ApiOkResponse({
    description: 'User is authenticated.',
    type: ValidateDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validate(): Promise<ValidateDto> {
    return this.authService.validate();
  }

  @ApiBearerAuth()
  @ApiTags('Authentication')
  @ApiOkResponse({
    description: 'User is authenticated.',
    type: TwoFADto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('2fa')
  twoFa(@Req() req): Promise<TwoFADto> {
    return this.authService.twoFa(req);
  }

  @ApiBearerAuth()
  @ApiTags('Authentication')
  @ApiBody({
    description: 'Provide TOTP from your authenticator app.',
    type: TOTPDto,
  })
  @ApiOkResponse({
    description: 'User is authenticated.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('2faverify')
  twoFaVerify(@Req() req): Promise<UserDto> {
    return this.authService.twoFaVerify(req);
  }

  @ApiBearerAuth()
  @ApiTags('Authentication')
  @ApiOkResponse({
    description: 'User is authorised.',
    type: ValidateDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('access')
  validateAccess(@Req() req): Promise<ValidateDto> {
    return this.authService.validateAccess(req);
  }

  @ApiBearerAuth()
  @ApiTags('Authentication')
  @ApiOkResponse({
    description: 'User is authorised.',
    type: ValidateDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  validateAdmin(@Req() req): Promise<ValidateDto> {
    return this.authService.validateAdmin(req);
  }
}
