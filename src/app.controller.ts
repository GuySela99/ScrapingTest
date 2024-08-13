import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { log } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/unblock")
  async unblock(@Query('url') url: string,@Query('render') render = true): Promise<string> {
    log("Received request to unblock: " + url,render);
     return  await this.appService.callDriverless(["https://" +url],render);
  }
}
