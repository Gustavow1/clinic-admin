import { Either } from "src/errors/either";
import { Patient } from "../entities/patient.entity";

export type GetPatientResponse = Either<Error, Patient>