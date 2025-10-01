import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { config } from "src/config/config";
import { redisClient } from "src/services/redis/service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let token = req.header("Authorization");
    token?.slice(0, 7) === "Bearer " ? token = token.slice(7) : null

    if (!token) return res.status(401).send("Authorization not found")
    
    try {
      redisClient.get(token).then((value) => {
        const isValid = value === config.API_KEY

        if (!isValid) return res.status(401).send("Invalid API Key");

        next()
      })
    } catch (error) {
      return res.status(401).send("Invalid API Key");
    }
  }
}