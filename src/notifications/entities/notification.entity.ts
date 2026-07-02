import { Newsletters } from 'src/newsletters/entities/newsletter.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  readAt: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    length: 0,
    default: () => 'now()',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Newsletters, (newsletter) => newsletter.notifications)
  @JoinColumn({ name: 'newsletter_id' })
  newsletter: Newsletters;
}
