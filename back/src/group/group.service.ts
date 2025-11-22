import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  async getGroups(platform_id?: string) {
    try {
      const where = platform_id ? { platform_id } : {};
      const groups = await this.groupRepo.find({
        where,
        relations: ['artists'],
      });
      return {
        status: 'success',
        groups,
      };
    } catch (err) {
      return {
        status: 'error',
        message: `그룹 조회 실패: ${err.message}`,
      };
    }
  }

  async addGroup(name: string, link: string, platform_id: string) {
    try {
      const group = this.groupRepo.create({
        name,
        link,
        platform_id,
      });
      const savedGroup = await this.groupRepo.save(group);
      return {
        status: 'success',
        message: '그룹이 성공적으로 추가되었습니다.',
        group: savedGroup,
      };
    } catch (err) {
      return {
        status: 'error',
        message: `그룹 추가 실패: ${err.message}`,
      };
    }
  }
}
