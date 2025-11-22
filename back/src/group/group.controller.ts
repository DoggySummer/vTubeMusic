import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroups(@Query('platform_id') platform_id?: string) {
    return await this.groupService.getGroups(platform_id);
  }

  @Post('add')
  async addGroup(
    @Body() body: { name: string; link: string; platform_id: string },
  ) {
    return await this.groupService.addGroup(
      body.name,
      body.link,
      body.platform_id,
    );
  }
}
