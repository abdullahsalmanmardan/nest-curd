import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

// 📌 What is a Module in NestJS?
// A module in NestJS is a fundamental building block that organizes related components (controllers, services, providers, and imports) into a self-contained unit. It helps structure the application by grouping functionalities and dependencies together.

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

// ✅ Encapsulates user-related features in a single unit.
// ✅ Manages database operations using TypeOrmModule.forFeature([User]).
// ✅ Provides UserService for handling business logic.
// ✅ Registers UserController for handling HTTP requests.
// ✅ Exports UserService so other modules can use it. 🚀

// This structure makes the User module reusable and maintainable. 🎯
