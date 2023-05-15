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

  @ApiProperty()
  version: boolean;
}

export class SuccessfulFetchDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  version: boolean;

  @ApiProperty()
  allVersions: Array<string>;
}
