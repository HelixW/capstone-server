import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ExceptionDto } from 'src/dto/exception.dto';
import {
  HashDto,
  SuccessfulFetchDto,
  SuccessfulUploadDto,
  UploadDto,
} from 'src/dto/upload.dto';
import { IpfsService } from './ipfs.service';
import { UserDto } from 'src/dto/auth.dto';
import { SuccessfulBrowseDto } from 'src/dto/browse.dto';

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
    type: UserDto,
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
  fetch(@Req() req): Promise<SuccessfulFetchDto> {
    return this.ipfsService.fetch(req);
  }

  @ApiBearerAuth()
  @ApiTags('IPFS')
  @ApiOkResponse({
    description: 'File downloaded successfully.',
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
  @Get('download/:hash')
  download(@Param('hash') hash, @Res() response) {
    return this.ipfsService.download(response, hash);
  }

  @ApiBearerAuth()
  @ApiTags('IPFS')
  @ApiBody({
    description: 'Provide file and access level of the file to be uploaded.',
    type: UploadDto,
  })
  @ApiOkResponse({
    description: 'File upload successful.',
    type: UserDto,
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (_, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  @Post('upload')
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<SuccessfulUploadDto> {
    return this.ipfsService.upload(file, req);
  }

  @ApiBearerAuth()
  @ApiTags('IPFS')
  @ApiOkResponse({
    description: 'Files successfully fetched',
    type: SuccessfulBrowseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorised to perform this action.',
    type: ExceptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('browse')
  browse(@Req() req): Promise<SuccessfulBrowseDto> {
    return this.ipfsService.browse(req);
  }
}
