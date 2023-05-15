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
import { create } from 'ipfs-http-client';
import { SuccessfulFetchDto, SuccessfulUploadDto } from 'src/dto/upload.dto';
import { createReadStream } from 'fs';
import { SuccessfulBrowseDto } from 'src/dto/browse.dto';
import * as fs from 'fs';

@Injectable()
export class IpfsService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
  ) {}

  async fetch(req): Promise<SuccessfulFetchDto> {
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

    return {
      message: 'File found in the network.',
      name: res.name,
      size: res.size,
      hash: res.hash,
    };
  }

  async upload(fileData, req): Promise<SuccessfulUploadDto> {
    // If body isn't provided
    if (!req || !fileData)
      throw new BadRequestException('Invalid data provided.');

    const file = createReadStream(fileData.path);

    const data: any = {};

    // Uploading file to IPFS network
    const ipfs = await this.ipfsClient();
    const ret = await ipfs.add(file);

    // Updating data document
    const re = /(?:\.([^.]+))?$/;

    data.id = uuidv4();
    data.hash = String(ret.cid);
    data.access = Number(req.headers.alevel);
    data.fileType = re.exec(fileData.filename)[1];
    data.size = fileData.size;
    data.name = fileData.filename;

    // Checking if the identical file already exists
    const res = await this.uploadModel.findOne({ hash: data.hash }).exec();
    if (res !== null)
      throw new BadRequestException(
        'Uploaded file already exists in the network.',
      );
    else await this.uploadModel.create(data);

    return {
      message: 'File successfully uploaded to the IPFS network.',
      hash: data.hash,
    };
  }

  async ipfsClient() {
    const ipfs = await create({
      host: 'localhost',
      port: 5001,
      protocol: 'http',
    });

    return ipfs;
  }

  async browse(req): Promise<SuccessfulBrowseDto> {
    // Checking for authorisation
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken: any = this.jwtService.decode(token);

    if (!decodedToken)
      throw new UnauthorizedException(
        'User is not authorised to perform this action.',
      );

    const files = await this.uploadModel.find();

    return {
      message: 'Files fetched from the network successfully.',
      files,
    };
  }

  async download(hash) {
    const res = await this.uploadModel.findOne({ hash }).exec();
    if (res === null)
      throw new BadRequestException('File not found with the given hash.');

    // TODO: remove buffer read
    const ipfs = await this.ipfsClient();
    const resp = await ipfs.cat(hash);

    // Rebuild file from buffer
    let content = [];
    for await (const chunk of resp) {
      content = [...content, ...chunk];
    }
    const raw = Buffer.from(content);

    await fs.writeFile(
      `${process.cwd()}/src/downloads/${res.name}`,
      raw,
      (err: any) => {
        if (err) {
          console.log(err);
          throw new BadRequestException(
            'File could not be saved in the server.',
          );
        }

        console.log('File successfully saved to folder.');
      },
    );

    return fs.createReadStream(`${process.cwd()}/src/downloads/${res.name}`);
  }
}
