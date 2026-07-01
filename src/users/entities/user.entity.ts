import { CoreEntity } from 'src/common/entities/core.entity';
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

  @OneToMany(() => Subscriptions, (subscription) => subscription.user)
  subscriptions: Subscriptions[];
}
