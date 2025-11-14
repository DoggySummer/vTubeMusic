import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { Group } from '../group/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Group])],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}

