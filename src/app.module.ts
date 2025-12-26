import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimit } from './ratelimit.service';
import { UserService } from './user.service';
import { GraphQLService } from './graphql.service';
import { Dashboard } from './dashboard.controller'

@Module({
  imports: [],
  controllers: [AppController, Dashboard],
  providers: [AppService, RateLimit, UserService, GraphQLService],
})
export class AppModule {}
