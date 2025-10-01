import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import {} from "jsonwebtoken"
import { AuthData } from "./dto/auth-data.dto";
import { JwtService } from "src/services/jwt";
import { config } from "../config/config"
import { redisClient } from "src/services/redis/service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {

  @Post()
  async validate(@Body() data: AuthData, @Res() res: Response) {

    const token = JwtService.generateToken(data.apiKey)

    const isValid = data.apiKey === config.API_KEY

    if (!isValid) return res.status(401).json({ isValid: false, token: "" })
    
    await redisClient.set(token, data.apiKey)

    return res.json({isValid: true, token});
  }
}