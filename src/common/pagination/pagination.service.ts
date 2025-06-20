import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    page: number = 1,
    limit: number = 10,
    options?: FindManyOptions<T>,
  ) {
    const [data, total] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ...options,
    });

    return {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
}
