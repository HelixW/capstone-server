import { ApiProperty } from '@nestjs/swagger';

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

export class HashDto {
  @ApiProperty()
  hash: string;
}

export class UploadDto {
  @ApiProperty()
  file: File;

  @ApiProperty()
  access: number;
}

export class SuccessfulUploadDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  hash: string;
}

export class SuccessfulFetchDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: string;
}
