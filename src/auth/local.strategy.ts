import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(): Promise<any> {
    return 'Success';
  }
}
