import { Categories } from 'src/categories/entities/category.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    length: 0,
    default: () => 'now()',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Categories, (category) => category.subscriptions)
  @JoinColumn({ name: 'category_id' })
  category: Categories;
}
