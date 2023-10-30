import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }

  existUser(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
