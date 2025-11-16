import { BaseError } from "src/errors/base-error";

export class PatientNotFoundError extends Error implements BaseError {
  constructor(patientName: string) {
    super(`The patient ${patientName} not found.`);
    this.name = "PatientNotFoundError";
  }
}