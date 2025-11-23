import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { Group } from '../group/group.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  async getArtist(name: string) {
    try {
      const artist = await this.artistRepo.findOne({
        where: { name },
        relations: ['group', 'songs'],
      });

      if (!artist) {
        return {
          status: 'error',
          message: `아티스트를 찾을 수 없습니다. name: ${name}`,
        };
      }

      return {
        status: 'success',
        artist: {
          ...artist,
          song: artist.songs || [],
        },
      };
    } catch (err) {
      return {
        status: 'error',
        message: `아티스트 조회 실패: ${err.message}`,
      };
    }
  }

  async addArtist(
    name: string,
    group_id: string,
    platform_link: string,
    platform_id: '1' | '2' | '3',
    youtube_link: string,
  ) {
    try {
      // group_id로 Group 찾기
      const group = await this.groupRepo.findOne({
        where: { id: parseInt(group_id) },
      });

      if (!group) {
        return {
          status: 'error',
          message: `그룹을 찾을 수 없습니다. group_id: ${group_id}`,
        };
      }

      const artist = this.artistRepo.create({
        name,
        platform_link,
        platform_id,
        youtube_link,
        group,
      });
      const savedArtist = await this.artistRepo.save(artist);
      return {
        status: 'success',
        message: '아티스트가 성공적으로 추가되었습니다.',
        artist: savedArtist,
      };
    } catch (err) {
      return {
        status: 'error',
        message: `아티스트 추가 실패: ${err.message}`,
      };
    }
  }

  async updateThumbnail(name: string, thumbnail: string) {
    try {
      const artist = await this.artistRepo.findOne({
        where: { name },
      });

      if (!artist) {
        return {
          status: 'error',
          message: `아티스트를 찾을 수 없습니다. name: ${name}`,
        };
      }

      artist.thumbnail = thumbnail;
      const updatedArtist = await this.artistRepo.save(artist);

      return {
        status: 'success',
        message: '썸네일이 성공적으로 업데이트되었습니다.',
        artist: updatedArtist,
      };
    } catch (err) {
      return {
        status: 'error',
        message: `썸네일 업데이트 실패: ${err.message}`,
      };
    }
  }
}
