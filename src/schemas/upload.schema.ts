import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UploadDocument = HydratedDocument<Upload>;

@Schema()
export class Upload {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  access: number;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false, default: false })
  version: boolean;

  @Prop({ required: false })
  allVersions: Array<string>;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
