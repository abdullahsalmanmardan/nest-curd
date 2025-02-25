import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// @Injectable() → Marks this class as a service that can be injected into other parts of the app.
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    // Injects the User repository to interact with the database.
    private readonly userRepo: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async findOne(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new Error('User not found');
    }

    return { success: true, message: 'User deleted successfully' };
  }
}

// Encapsulates business logic related to users.
// Ensures secure password storage using bcrypt.
// Uses TypeORM repository for database interactions. 🚀
