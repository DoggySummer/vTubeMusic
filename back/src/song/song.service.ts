import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { Artist } from '../artist/artist.entity';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
  ) {}

  async checkConnection() {
    try {
      const count = await this.songRepo.count();
      return {
        status: 'success',
        connected: true,
        message: 'Supabase Session Pooler 연결 성공',
        songCount: count,
      };
    } catch (err) {
      return {
        status: 'error',
        connected: false,
        message: `DB 연결 실패: ${err.message}`,
      };
    }
  }

  async addSong(
    vId: string,
    artist_name: string,
    uploaded_at: string,
    type: string,
    image: string,
    link: string,
    title: string,
    name: string,
  ) {
    try {
      // artist_name으로 Artist 찾기
      const artist = await this.artistRepo.findOne({
        where: { name: artist_name },
      });

      if (!artist) {
        return {
          status: 'error',
          message: `아티스트를 찾을 수 없습니다. artist_name: ${artist_name}`,
        };
      }

      // Artist 객체를 할당하면 TypeORM이 자동으로 artist.id를 artist_id 외래키로 사용
      const song = this.songRepo.create({
        vId,
        title,
        name,
        link,
        image,
        type,
        uploaded_at,
        artist,
      });
      const savedSong = await this.songRepo.save(song);
      return {
        status: 'success',
        message: '노래가 성공적으로 추가되었습니다.',
        song: savedSong,
      };
    } catch (err) {
      return {
        status: 'error',
        message: `노래 추가 실패: ${err.message}`,
      };
    }
  }
}
