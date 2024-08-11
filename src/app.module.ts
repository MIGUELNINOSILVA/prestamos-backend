import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
