import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/repositories/categories.repositories';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}
  findAllByUserId(userId: string) {
    return this.categoriesRepo.findyMany({
      where: { userId },
    });
  }
}
