import { CoreEntity } from 'src/common/entities/core.entity';
import { Newsletters } from 'src/newsletters/entities/newsletter.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Categories extends CoreEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  categoryName: string;

  @OneToMany(() => Newsletters, (newsletter) => newsletter.category)
  newsletters: Newsletters[];
}
