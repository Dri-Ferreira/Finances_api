import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/shared/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getUserById(userId: string) {
    return await this.usersRepo.existUser({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
  }
}
