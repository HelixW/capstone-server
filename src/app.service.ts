import { Injectable } from '@nestjs/common';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class AppService {
  getStatus(): StatusDto {
    return { message: 'Server online.' };
  }
}
