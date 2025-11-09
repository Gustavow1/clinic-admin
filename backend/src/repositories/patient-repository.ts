import { CreatePatientResponse } from "src/patients/dto/create-patient-response.dto";
import { CreatePatientDto } from "src/patients/dto/create-patient.dto";
import { DeletePatientResponse } from "src/patients/dto/delete-patient-response.dto";
import { GetPatientDto } from "src/patients/dto/get-patient-data.dto";
import { GetPatientResponse } from "src/patients/dto/get-patient-response.dto";
import { UpdatePatientResponse } from "src/patients/dto/update-patient-response.dto";
import { UpdatePatientDto } from "src/patients/dto/update-patient.dto";
import { Patient } from "src/patients/entities/patient.entity";

export abstract class PatientRepository {
  abstract create(data: CreatePatientDto): Promise<CreatePatientResponse>;
  abstract getOne(data: GetPatientDto): Promise<GetPatientResponse>
  abstract getAll(): Promise<Patient[]>;
  abstract delete(id: string): Promise<DeletePatientResponse>
  abstract update(data: UpdatePatientDto): Promise<UpdatePatientResponse>
}
