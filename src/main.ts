import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exception/global-exception.filter';
import { CustomSocketIoAdapter } from './common/adapter/websocket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: 'http://www.siggwon-moa.shop',
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
    credentials: true,
  });

  app.useWebSocketAdapter(new CustomSocketIoAdapter(app));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
