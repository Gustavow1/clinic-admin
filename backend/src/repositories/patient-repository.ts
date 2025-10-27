import { CreatePatientDto } from "src/patients/dto/create-patient.dto";
import { GetPatientDto } from "src/patients/dto/get-patient-data.dto";
import { GetPatientResponse } from "src/patients/dto/get-patient-response.dto";
import { Patient } from "src/patients/entities/patient.entity";

export abstract class PatientRepository {
  abstract create(data: CreatePatientDto): Promise<Error | void>;
  abstract getOne(data: GetPatientDto): Promise<GetPatientResponse>
  abstract getAll(): Promise<Patient[]>;
  abstract delete(id: string): Promise<void>
}
