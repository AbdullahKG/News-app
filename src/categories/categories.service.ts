import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll(query: GetCategoryDto) {
    return this.categoryRepository.findAll(query);
  }

  findOne(id: string) {
    return this.categoryRepository.findOne(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.remove(id);
  }
}
