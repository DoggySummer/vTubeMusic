import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.userRepo.count();
      console.log('hello db, user table row count:', count);
    } catch (err) {
      console.error('DB 연결 실패:', err.message);
    }
  }

  async checkConnection() {
    try {
      const count = await this.userRepo.count();
      return {
        status: 'success',
        connected: true,
        message: 'Supabase Session Pooler 연결 성공',
        userCount: count,
      };
    } catch (err) {
      return {
        status: 'error',
        connected: false,
        message: `DB 연결 실패: ${err.message}`,
      };
    }
  }
}
