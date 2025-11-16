import { BaseError } from "src/errors/base-error";

export class PatientIdNotFoundError extends Error implements BaseError {
  constructor(id: string) {
    super(`The patient id ${id} not found.`);
    this.name = "PatientIdNotFoundError";
  }
}