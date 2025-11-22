import { Controller, Get, Post, Body } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post('add')
  async addSong(
    @Body()
    body: {
      vId: string;
      artist_name: string;
      uploaded_at: string;
      type: string;
      image: string;
      link: string;
      title: string;
      name: string;
    },
  ) {
    return await this.songService.addSong(
      body.vId,
      body.artist_name,
      body.uploaded_at,
      body.type,
      body.image,
      body.link,
      body.title,
      body.name,
    );
  }
}
