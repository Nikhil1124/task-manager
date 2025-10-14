import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module'; // <-- import UsersModule

@Module({
  imports: [AuthModule, TasksModule, UsersModule], // <-- add UsersModule here
  providers: [PrismaService],
})
export class AppModule {}
