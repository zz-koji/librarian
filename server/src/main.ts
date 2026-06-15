import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  if (process.env.PORT === undefined) {
    throw new Error('PORT environment variable is not set.');
  }

  await app.listen(process.env.PORT);
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to bootstrap', err);
  process.exit(1);
});
