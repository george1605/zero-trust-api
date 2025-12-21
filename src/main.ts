import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // folder for templates
  app.setViewEngine('hbs'); // Handlebars
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
