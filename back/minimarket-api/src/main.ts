import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';


async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Habilita CORS si es necesario
  app.enableCors();

  // Configura la ruta para servir archivos estáticos
  server.use(express.static(String.raw`C:\Users\matic\OneDrive\Documentos\Sistema de cobros\Sistema-De-Cobros\front`));

  await app.listen(3000);
}

bootstrap();