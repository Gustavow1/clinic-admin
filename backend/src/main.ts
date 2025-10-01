import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Clinic API Documentation")
    .setDescription("Clinic API Documentation and Examples")
    .setVersion("1.0.0")
    .addTag("patient")
    .build()
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin: process.env.CORS_ORIGIN ?? "*"})
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
