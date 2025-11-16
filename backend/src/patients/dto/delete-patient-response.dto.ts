import { Either } from "src/errors/either";
import { PatientIdNotFoundError } from "../errors/patient-id-not-found";

export type DeletePatientResponse = Either<PatientIdNotFoundError | Error, string>;