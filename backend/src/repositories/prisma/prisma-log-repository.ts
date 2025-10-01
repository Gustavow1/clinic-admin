import { Injectable } from "@nestjs/common";
import { LogRepository } from "../log-repository";
import { PrismaService } from "src/database/prisma.service";
import { ILog } from "src/interfaces/log";

@Injectable()
export class PrismaLogRepository implements LogRepository {
  constructor(private prisma: PrismaService) { }
  
  async create(data: ILog) {
    const { requestTime, responseTime, method, url, statusCode, userAgent, body, query, params } = data
    
    await this.prisma.log.create({
      data: {
        requestTime,
        responseTime,
        method,
        url,
        statusCode,
        userAgent,
        body,
        params,
        query
      }
    })
  }

  async getAll(): Promise<ILog[]> {
    const logs = await this.prisma.log.findMany()
    return logs
  }
}