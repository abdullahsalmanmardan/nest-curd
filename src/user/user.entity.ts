import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity() → Marks this class as a database table named user.

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}

// This file maps the User class to a database table (user).
// It tells TypeORM how the table should be structured.
// Used for database interactions (inserting, updating, querying users).
