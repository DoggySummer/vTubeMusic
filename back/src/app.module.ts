import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeORM 설정 (Supabase PostgreSQL - Session Pooler)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT') || 6543, // Session Pooler 포트
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User],
        synchronize: config.get<string>('NODE_ENV') === 'development', // 개발 환경에서만 true
        ssl: { rejectUnauthorized: false }, // Supabase SSL 연결 시 필요
        extra: {
          // Supabase Session Pooler 연결 풀 최적화
          max: 100, // Session Pooler는 더 많은 연결 지원
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
