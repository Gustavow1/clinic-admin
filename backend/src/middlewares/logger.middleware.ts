import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { config, rabbitMQConfig } from "src/config/config";
import { RabbitMQService } from "src/services/rabbitmq/rabbitmq.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly rabbitMQService: RabbitMQService){}
  use(req: Request, res: Response, next: NextFunction) {
    const requestTime = new Date()
    res.on("finish", async () => {
      const responseTime = new Date();
      const { method, url } = req
      const userAgent = req.get("user-agent")
      const statusCode = res.statusCode

      const logInput = {
        requestTime,
        responseTime,
        method,
        url,
        statusCode,
        userAgent: userAgent ?? null,
        body: req.body,
        params: req.params,
        query: req.query,
      }

      if (config.LOGGER == "ON") {
        await this.rabbitMQService.publishInQueue(
          rabbitMQConfig.queue,
          logInput,
        );
      }
    })
    next()
  }
}