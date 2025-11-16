import { Either } from "src/errors/either";
import { DocumentIdAlreadyExistsError } from "../errors/documentId-already-exists";

export type CreatePatientResponse = Either<DocumentIdAlreadyExistsError | Error, string>