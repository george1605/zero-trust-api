import { Controller, Get, Post, Body, Req, Res, Ip, HttpException, HttpStatus, Render, Param } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimit } from './ratelimit.service';
import { UserService } from './user.service';
import type { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private rateLimit: RateLimit, private userService: UserService) { }

  // the hello route for testing
  @Get('/hello')
  getHello(): string {
    this.rateLimit.setLimit(5); // just for demo and experimentation
    return this.appService.getHello();
  }

  @Get('/')
  getApp(@Res() res: Response) {
    return res.status(200).render('app', {});
  }

  // the magic is here!
  @Get('/api/*path')
  async handleApi(
    @Param('path') path: string,
    @Ip() clientIP: string,
    @Res() res: Response
  ) {
    // Rate-limit check
    if (!this.rateLimit.checkLimit(clientIP)) {
      return res.status(429).send({ error: 'Too many requests' });
    }
    this.rateLimit.increment(clientIP);

    const parts = String(path).split('/');

    switch (parts[0]) {
      case 'users':
        const size = Number(parts[1]) || 1;
        const users = await this.userService.getUsers(size);
        return res.send(users);
      default:
        return res.status(404).send({
          error: 'Unknown API path',
          requestedPath: `/api/${path}`,
        });
    }
  }

  @Post('/api/register')
  async register(@Body() body: { username: string; password: string }, @Req() req: Request) {
    await this.userService.addUser(body.username, body.password); // 
    //if(!req.secure)
    //{
    //  throw new ForbiddenException('HTTPS required');
    //}
    return { message: "User added" }
  }

  @Get()
  async getPage(@Ip() clientIP: string, @Res() res: Response) {
    if (!this.rateLimit.checkLimit(clientIP)) {

      return res.status(429).setHeader('Retry-After', '60').render('error', {
        status: 429,
        message: 'Too many requests',
      });
    }

    this.rateLimit.increment(clientIP);
    const pageHtml = this.appService.getPage(); // your normal page
    return res.send(pageHtml);
  }
}
