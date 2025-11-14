import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async checkConnection() {
    return await this.artistService.checkConnection();
  }

  @Post('add')
  async addArtist(
    @Body()
    body: {
      name: string;
      group_id: string;
      platform_link: string;
      platform_id: '1' | '2' | '3';
      youtube_link: string;
    },
  ) {
    return await this.artistService.addArtist(
      body.name,
      body.group_id,
      body.platform_link,
      body.platform_id,
      body.youtube_link,
    );
  }
}
