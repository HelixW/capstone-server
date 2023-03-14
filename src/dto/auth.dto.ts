import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;
}

export class RegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
