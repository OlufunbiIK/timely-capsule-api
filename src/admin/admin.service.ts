import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Capsule)
    private readonly capsuleRepository: Repository<Capsule>,
    private readonly paginationService: PaginationService,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async findCapsulesByUnlockStatus(
    isUnlocked?: boolean,
    page: number = 1,
    limit: number = 10,
  ) {
    // Validate the input
    if (isUnlocked !== undefined && typeof isUnlocked !== 'boolean') {
      throw new BadRequestException('Invalid isUnlocked parameter');
    }

    const queryBuilder = this.capsuleRepository.createQueryBuilder('capsule');

    if (isUnlocked !== undefined) {
      if (isUnlocked) {
        queryBuilder.where('capsule.unlockAt <= CURRENT_TIMESTAMP');
      } else {
        queryBuilder.where('capsule.unlockAt > CURRENT_TIMESTAMP');
      }
    }

    // Execute the query and get filtered capsules
    const filteredCapsules = await queryBuilder.getMany();

    // Convert the array to a temporary repository-like object
    const customRepository = {
      find: ({ skip, take }) =>
        Promise.resolve(filteredCapsules.slice(skip, skip + take)),
      count: () => Promise.resolve(filteredCapsules.length),
    };

    return await this.paginationService.paginationQuery(
      { page, limit },
      customRepository as Repository<Capsule>,
    );
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
