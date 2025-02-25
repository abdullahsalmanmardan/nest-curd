// This is the controller for handling user-related operations in the NestJS application. Controllers in NestJS are responsible for handling incoming requests and returning responses.\\

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';

// Defines that this controller handles routes prefixed with /users.
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Body, @Param, ParseIntPipe: Extract request data from the body or URL parameters.
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.userService.register(body.email, body.password);
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id.toString()); // Safe type usage
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message: string }> {
    return await this.userService.delete(id);
  }
}

// Summary of Decorators Used
// Decorator	Purpose
// @Controller('users')	Defines the base route for this controller.
// @Post('register')	Handles POST requests for user registration.
// @Get(':id')	Handles GET requests for fetching a user by ID.
// @Delete(':id')	Handles DELETE requests for deleting a user.
// @Body()	Extracts the request body.
// @Param('id', ParseIntPipe)	Extracts and validates the id parameter.
