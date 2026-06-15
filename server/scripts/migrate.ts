import { Kysely, PostgresDialect } from 'kysely';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileMigrationProvider, MigrationResultSet, Migrator } from 'kysely/migration';
import { Pool } from 'pg';

async function run() {
  const db = new Kysely<unknown>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: process.env.LIBRARIAN_DATABASE_URL }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'migrations'),
    }),
  });

  const cmd = process.argv[2];

  if (cmd === 'list') {
    const all = await migrator.getMigrations();

    all.forEach((m) => {
      console.log(`${m.executedAt ? '[DONE]' : '[PENDING]'} ${m.name}`);
    });
    await db.destroy();
    return;
  }

  let migrationResult: MigrationResultSet;

  if (cmd === 'down') {
    migrationResult = await migrator.migrateDown();
  } else {
    migrationResult = await migrator.migrateToLatest();
  }

  if (migrationResult.results) {
    migrationResult.results.forEach((r) => {
      if (r.status === 'Success') {
        console.log(`[ok] ${r.migrationName}`);
      } else {
        console.log(`[failed] ${r.migrationName}`);
      }
    });
  }

  if (migrationResult.error) {
    console.error(`Migration failed: `, migrationResult.error);
    process.exit(1);
  }

  await db.destroy();
}

run().catch((e: unknown) => {
  console.error(`Failed to migrate: `, e);
});
