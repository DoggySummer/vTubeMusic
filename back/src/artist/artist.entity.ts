import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from 'src/group/group.entity';

@Entity('Artist')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  platform_id: string;

  @Column({ nullable: true })
  platform_link: string;

  @Column({ nullable: true })
  youtube_link: string;

  @ManyToOne(() => Group, (group) => group.artists)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
