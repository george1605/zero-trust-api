import { Injectable, Render } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    
    return 'Hello World!';
  }

  getPage(): string {
    return '<h2>Zero Trust API Platform</h2>'
  }

}
