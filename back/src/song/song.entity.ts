import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../artist/artist.entity';

@Entity('Song')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vId: string;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  uploaded_at: string;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}
