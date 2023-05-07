import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  access: number;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  name: string;
}

export class SuccessfulBrowseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ isArray: true, type: FileDto })
  files: FileDto[];
}
