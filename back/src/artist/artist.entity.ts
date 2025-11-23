import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Group } from 'src/group/group.entity';
import { Song } from 'src/song/song.entity';

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

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne(() => Group, (group) => group.artists)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];
}
