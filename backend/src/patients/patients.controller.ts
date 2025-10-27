import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Delete,
} from "@nestjs/common";
import { PatientRepository } from "../repositories/patient-repository";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { Response } from "express";
import { GetPatientDto } from "./dto/get-patient-data.dto";
import { ApiTags } from "@nestjs/swagger";
import { redisClient } from "../services/redis/service";
import { Throttle } from "@nestjs/throttler";
import { DeletePatientDTO } from "./dto/delete-patient.dto";

@ApiTags("Patient")
@Controller("patient")
export class PatientsController {
  constructor(
    private readonly patientRepository: PatientRepository,
  ) { }
  
  @Throttle({default: {limit: 60000, ttl: 2}})
  @Post()
  async register(@Body() data: CreatePatientDto, @Res() res: Response) {
    try {
      await this.patientRepository.create(data);
      res.status(201).json();
      await redisClient.del("patients")
    } catch (error) {
      res.status(400).json(error.message)
    }
  }

  @Get()
  async get(@Body() data: GetPatientDto, @Res() res: Response) {
    const result = await this.patientRepository.getOne(data);
    if (result.isLeft()) return res.status(400).json(result.value.message);
    res.json(result.value);
  }

  @Get("all")
  async all(@Res() res: Response) {
    const cachedPatients = await redisClient.get("patients") ?? null
    if (!cachedPatients) {
      const patients = await this.patientRepository.getAll();
      redisClient.set("patients", JSON.stringify(patients ?? []));
      return res.json(patients);
    }
    res.json(JSON.parse(cachedPatients));
  }

  @Delete()
  async delete(@Body() data: DeletePatientDTO, @Res() res: Response) {
    await this.patientRepository.delete(data.id)
    await redisClient.del("patients")
    return res.status(200)
  }
}
