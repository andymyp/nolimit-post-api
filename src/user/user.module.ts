import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { JwtStrategy } from './auth/jwt-strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
