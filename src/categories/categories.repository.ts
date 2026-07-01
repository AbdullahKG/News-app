import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { ILike, Repository, DeleteResult } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    const { categoryName } = createCategoryDto;

    const newCategory = new Categories();
    newCategory.categoryName = categoryName;

    try {
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('this category name already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    query: GetCategoryDto,
  ): Promise<{ categories: Categories[]; total: number }> {
    const { search, limit, offset } = query;

    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: [{ categoryName: search ? ILike(`%${search}%`) : undefined }],
    });

    return { categories, total };
  }

  async findOne(id: string): Promise<Categories> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Categories> {
    const foundCategory = await this.findOne(id);

    const { categoryName } = updateCategoryDto;

    foundCategory.categoryName = categoryName ?? foundCategory.categoryName;

    try {
      return await this.categoryRepository.save(foundCategory);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('this category name already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    const deletedResult = await this.categoryRepository.softDelete(id);

    if (deletedResult.affected === 0) {
      throw new NotFoundException('Category not found');
    }

    return deletedResult;
  }
}
