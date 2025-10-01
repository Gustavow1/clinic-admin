import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { EmployeeLoginData } from "./dto/employee-login-data.dto";
import { JwtService } from "src/services/jwt";
import { config } from "src/config/config";
import { redisClient } from "src/services/redis/service";

@ApiTags("Employees")
@Controller("employee")
export class EmployeesController {
  @Post("login")
  async login(@Body() data: EmployeeLoginData, @Res() res: Response) {
    const { name, password } = data

    if (name !== "admin" || password !== "admin") return res.status(400).json()
    
    const token = JwtService.generateToken(String(config.API_KEY));

    await redisClient.set(token, String(config.API_KEY));

    return res.json({token});
  }
}