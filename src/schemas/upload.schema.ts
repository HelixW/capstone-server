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
  fileName: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
