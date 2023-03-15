import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from 'src/schemas/upload.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IpfsService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
  ) {}

  async fetch(req): Promise<string> {
    const hash = req.body.hash;

    // If hash isn't provided
    if (!hash) throw new BadRequestException('Hash of file not found.');

    // Finding the file
    const res = await this.uploadModel.findOne({ hash }).exec();
    if (res === null)
      throw new BadRequestException('Hash of file provided is invalid');

    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken.access !== res.access)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    return 'Found';
  }

  async upload(req): Promise<string> {
    const file = req;

    // If file isn't provided
    if (!file) throw new BadRequestException('File not uploaded.');

    file.id = uuidv4();

    // Checking if the identical file already exists
    const res = await this.uploadModel.findOne({ hash: file.hash }).exec();
    if (res !== null)
      throw new BadRequestException(
        'Uploaded file already exists in the network.',
      );
    else await this.uploadModel.create(file);

    return 'File uploaded';
  }
}
