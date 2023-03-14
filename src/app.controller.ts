import { Controller, Get } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { StatusDto } from './dto/status.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Server')
  @ApiOkResponse({
    description: 'Server status is displayed.',
    type: StatusDto,
  })
  @Get('status')
  status(): StatusDto {
    return this.appService.getStatus();
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('rest')
  // async rest() {
  //   return 'Authorised';
  // }
}
