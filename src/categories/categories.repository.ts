import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository, DeleteResult } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { categoryName } = createCategoryDto;

    const newCategory = new Category();
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
  ): Promise<{ categories: Category[]; total: number }> {
    const { search, limit, offset } = query;

    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: [{ categoryName: search ? ILike(`%${search}%`) : undefined }],
    });

    return { categories, total };
  }

  async findOne(id: string): Promise<Category> {
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
  ): Promise<Category> {
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
