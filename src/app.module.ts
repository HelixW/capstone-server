import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { IpfsModule } from './ipfs/ipfs.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.DATABASE_URI}`),
    IpfsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
