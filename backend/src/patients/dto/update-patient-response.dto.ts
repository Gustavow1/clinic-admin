import { Either } from "src/errors/either";
import { PatientNotFoundError } from "../errors/patient-not-found";

export type UpdatePatientResponse = Either<PatientNotFoundError | Error, string>;