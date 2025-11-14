import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Artist } from 'src/artist/artist.entity';

@Entity('Group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  platform_id: string;

  @OneToMany(() => Artist, (artist) => artist.group)
  artists: Artist[];

  @CreateDateColumn()
  created_at: Date;
}
