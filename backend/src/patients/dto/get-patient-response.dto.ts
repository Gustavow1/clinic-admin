import { Either } from "src/errors/either";
import { Patient } from "../entities/patient.entity";
import { PatientNotFoundError } from "../errors/patient-not-found";

export type GetPatientResponse = Either<PatientNotFoundError | Error, Patient>