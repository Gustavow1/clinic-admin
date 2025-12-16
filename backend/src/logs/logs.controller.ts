import { Controller, Get, Res } from "@nestjs/common";
import { LogRepository } from "src/repositories/log-repository";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Logs")
@Controller("logs")
export class LogsController {
  constructor(private readonly logRepository: LogRepository) { }
  
  @Get()
  async get(@Res() res: Response) {
    return res.json(await this.logRepository.getAll())
  }
}