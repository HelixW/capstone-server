import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Upload, UploadSchema } from 'src/schemas/upload.schema';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    MulterModule.register({ dest: './src/uploads' }),
  ],
  providers: [IpfsService, JwtService],
  exports: [IpfsService],
  controllers: [IpfsController],
})
export class IpfsModule {}
