import { ApiProperty } from '@nestjs/swagger';

export class CreatedUserDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;
}

export class ExistsDto {
  @ApiProperty()
  error: true;

  @ApiProperty()
  message: string;
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
