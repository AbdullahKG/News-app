import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends CoreEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  categoryName: string;
}
