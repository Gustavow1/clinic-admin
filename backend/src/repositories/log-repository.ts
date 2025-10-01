import { ILog } from "src/interfaces/log";

export abstract class LogRepository {
  abstract create(data: ILog): Promise<void>
  abstract getAll(): Promise<ILog[]>
}