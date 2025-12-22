import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Delete,
  Patch,
} from "@nestjs/common";
import { PatientRepository } from "../repositories/patient-repository";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { Response } from "express";
import { GetPatientDto } from "./dto/get-patient-data.dto";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { DeletePatientDTO } from "./dto/delete-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

@ApiTags("Patient")
@Controller("patient")
export class PatientsController {
  constructor(
    private readonly patientRepository: PatientRepository,
  ) { }
  
  @Throttle({default: {limit: 60000, ttl: 2}})
  @Post()
  async register(@Body() data: CreatePatientDto, @Res() res: Response) {
    const result = await this.patientRepository.create(data);
    if (result.isLeft()) {
      switch (result.value.name) {
        case "DocumentIdAlreadyExistsError":
          return res.status(409).send({ message: "DocumentId already exists" })
        default:
          return res.status(400).json(result.value.message);
      }
    }
    return res.status(201).send();
  }

  @Get()
  async get(@Body() data: GetPatientDto, @Res() res: Response) {
    const result = await this.patientRepository.getOne(data);
    if (result.isLeft()) {
      switch (result.value.name) {
        case "PatientNotFoundError":
          return res.status(409).send({ message: "Patient not found" });
        default:
          return res.status(400).json(result.value.message);
      }
    }
    return res.json(result.value);
  }

  @Get("all")
  async all(@Res() res: Response) {
    const patients = await this.patientRepository.getAll();
    return res.json(patients);
  }

  @Delete()
  async delete(@Body() data: DeletePatientDTO, @Res() res: Response) {
    const result = await this.patientRepository.delete(data.id)
    if (result.isLeft()) {
      switch (result.value.name) {
        case "PatientIdNotFoundError":
          return res.status(409).send({ message: "Patient not found by id" });
        default:
          return res.status(400).json(result.value.message);
      }
    }
    return res.status(200).send()
  }

  @Patch()
  async update(@Body() data: UpdatePatientDto, @Res() res: Response) {
    const result = await this.patientRepository.update(data)
    if (result.isLeft()) {
      switch (result.value.name) {
        case "PatientNotFoundError":
          return res.status(409).send({ message: "Patient not found" });
        default:
          return res.status(400).json(result.value.message);
      }
    }
    return res.status(200).send()
  }
}
