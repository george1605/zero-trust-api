import { Controller, Get, Req, Res, Ip, HttpException, HttpStatus, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimit } from './ratelimit.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private rateLimit: RateLimit) {}

  // the hello route for testing
  @Get('/hello')
  getHello(): string {
    this.rateLimit.setLimit(5); // just for demo and experimentation
    return this.appService.getHello();
  }

  @Get()
  async getPage(@Ip() clientIP: string, @Res() res: Response) {
    if (!this.rateLimit.checkLimit(clientIP)) {
      
      return res.status(429).render('error', {
        status: 429,
        message: 'Too many requests',
      });
    }

    this.rateLimit.increment(clientIP);
    const pageHtml = this.appService.getPage(); // your normal page
    return res.send(pageHtml);
  }
}
