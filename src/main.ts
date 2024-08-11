import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Prestamos');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.enableCors({
    origin: ['http://localhost:5173'], // Permitir solo peticiones desde localhost:5173
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type, Accept', // Cabeceras permitidas
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
  logger.log(`Multitenant runing on port ${envs.PORT}`);
}
bootstrap();
