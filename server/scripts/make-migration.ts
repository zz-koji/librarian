import { promises as fs } from 'fs';
import * as path from 'path';

const name = process.argv[2];
if (!name) {
  console.error('Usage: npm run db:make <name>');
  process.exit(1);
}

const n = new Date();
const pad = (x: number) => String(x).padStart(2, '0');
const ts =
  `${n.getUTCFullYear()}${pad(n.getUTCMonth() + 1)}${pad(n.getUTCDate())}` +
  `${pad(n.getUTCHours())}${pad(n.getUTCMinutes())}${pad(n.getUTCSeconds())}`;

const file = path.join(process.cwd(), 'migrations', `${ts}_${name}.ts`);
fs.writeFile(
  file,
  `import { Kysely, sql } from 'kysely';

   export async function up(db: Kysely<any>): Promise<void> {
   }

   export async function down(db: Kysely<any>): Promise<void> {
   }
   `,
)
  .then(() => {
    console.log(`Created migrations/${ts}_${name}.ts`);
  })
  .catch((e: unknown) => {
    console.error(`Failed to generate migration file:`, e);
  });
