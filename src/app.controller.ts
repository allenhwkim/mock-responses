import { Controller, Get, Query, Redirect } from '@nestjs/common';

@Controller('')
export class AppController {

  @Get()
  @Redirect('/developer', 302)
  home(@Query('foo') foo) {
    // if (foo === '5') {
    //   return { url: 'https://docs.nestjs.com/v5/' };
    // }
  }
}
