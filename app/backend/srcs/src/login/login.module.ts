import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './ft.strategy';
import { LoginController } from './login.controller';
import { SessionSerializer } from './session.serializer';
import { LoginService } from './login.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [LoginController],
  providers: [ConfigService, FortyTwoStrategy, SessionSerializer, LoginService],
})
export class LoginModule {}
