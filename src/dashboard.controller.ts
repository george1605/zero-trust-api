import { Controller, Get, Req, Res, Ip, HttpException, HttpStatus, Render } from '@nestjs/common';

@Controller()
export class Dashboard
{
    @Get('/dashboard')
    @Render('dashboard')
    getDashboard() {
      return {
        requestsPerMinute: 124,
        activeClients: 17,
        trustScore: 82,
        trustClass: 'ok', // ok | warn | bad
        rateLimitStatus: 'Normal',
        rateLimitClass: 'ok',
        lastEvent: {
          ip: '192.168.1.42',
          reason: 'Rate limit exceeded',
          time: '2025-01-23 21:14:02',
        },
      };
    }
}