import { Categories } from 'src/categories/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Notifications } from 'src/notifications/entities/notification.entity';
import { Users } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Newsletters extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, unique: false })
  title: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  body: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  cover_image: string;

  @ManyToOne(() => Categories, (category) => category.newsletters)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @ManyToOne(() => Users, (user) => user.newsletters)
  @JoinColumn({ name: 'author_id' })
  author: Users;

  @OneToMany(() => Notifications, (notification) => notification.newsletter)
  notifications: Notifications[];
}
