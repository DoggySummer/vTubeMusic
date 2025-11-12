import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseConnection(): Promise<{
    status: string;
    connected: boolean;
    message: string;
    database?: string;
    host?: string;
    port?: number;
  }> {
    try {
      // 간단한 쿼리로 연결 확인
      const result = await this.dataSource.query('SELECT 1 as test');
      
      const options = this.dataSource.options as any;
      
      return {
        status: 'success',
        connected: true,
        message: '데이터베이스 연결 성공',
        database: options.database,
        host: options.host,
        port: options.port,
      };
    } catch (error) {
      return {
        status: 'error',
        connected: false,
        message: `데이터베이스 연결 실패: ${error.message}`,
      };
    }
  }
}
