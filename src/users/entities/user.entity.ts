import { CoreEntity } from 'src/common/entities/core.entity';
import { Newsletters } from 'src/newsletters/entities/newsletter.entity';
import { Notifications } from 'src/notifications/entities/notification.entity';
import { Subscriptions } from 'src/subscriptions/entities/subscription.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Users extends CoreEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  role: string;

  @OneToMany(() => Subscriptions, (subscription) => subscription.subscriber)
  followedAuthors: Subscriptions[]; // authors this user follows

  @OneToMany(() => Subscriptions, (sub) => sub.author)
  followers: Subscriptions[]; // users following this user

  @OneToMany(() => Newsletters, (newsletter) => newsletter.author)
  newsletters: Newsletters[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];
}
