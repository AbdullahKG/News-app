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

  @ManyToOne(() => Users, (user) => user.followedAuthors)
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: Users;

  @ManyToOne(() => Users, (user) => user.followers)
  @JoinColumn({ name: 'author_id' })
  author: Users;
}
