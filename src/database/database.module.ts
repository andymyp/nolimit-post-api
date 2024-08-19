import { Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers/database.providers';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders]
})
export class DatabaseModule { }
