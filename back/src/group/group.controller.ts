import { Controller, Get, Post, Body } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async checkConnection() {
    return await this.groupService.checkConnection();
  }

  @Post('add')
  async addGroup(@Body() body: { name: string; link: string; platform_id: string }) {
    return await this.groupService.addGroup(body.name, body.link, body.platform_id);
  }
}

