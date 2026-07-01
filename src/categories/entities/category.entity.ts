import { CoreEntity } from 'src/common/entities/core.entity';
import { Subscriptions } from 'src/subscriptions/entities/subscription.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Categories extends CoreEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  categoryName: string;

  @OneToMany(() => Subscriptions, (subscription) => subscription.category)
  subscriptions: Subscriptions[];
}
