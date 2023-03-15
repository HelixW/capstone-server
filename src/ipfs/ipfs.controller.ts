import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ExceptionDto } from 'src/dto/exception.dto';
import { HashDto, UploadDto } from 'src/dto/upload.dto';
import { IpfsService } from './ipfs.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private ipfsService: IpfsService) {}

  @ApiBearerAuth()
  @ApiTags('IPFS')
  @ApiBody({
    description: 'Provide hash of file uploaded to IPFS.',
    type: HashDto,
  })
  @ApiOkResponse({
    description: 'File fetch successful.',
    // type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Hash of file provided is invalid.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('fetch')
  fetch(@Req() req): Promise<string> {
    return this.ipfsService.fetch(req);
  }

  @ApiBearerAuth()
  @ApiTags('IPFS')
  @ApiBody({
    description: 'Provide file and access level of the file to be uploaded.',
    type: UploadDto,
  })
  @ApiOkResponse({
    description: 'File upload successful.',
    // type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Uploaded file already exists in the network.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  upload(@Req() req): Promise<string> {
    return this.ipfsService.upload(req.body);
  }
}
