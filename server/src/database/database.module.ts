import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB_CONNECTION } from './database.tokens';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './db.types';

@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Kysely<DB> =>
        new Kysely<DB>({
          dialect: new PostgresDialect({
            pool: new Pool({
              connectionString: config.getOrThrow<string>('LIBRARIAN_DATABASE_URL'),
            }),
          }),
        }),
    },
  ],
  exports: [DB_CONNECTION],
})
export class DatabaseModule {}
