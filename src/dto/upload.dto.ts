import { ApiProperty } from '@nestjs/swagger';

export class HashDto {
  @ApiProperty()
  hash: string;
}

export class UploadDto {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  access: number;
}
