import { CreatePatientDto } from "src/patients/dto/create-patient.dto";
import { PatientRepository } from "../patient-repository";
import { GetPatientDto } from "src/patients/dto/get-patient-data.dto";
import { GetPatientResponse } from "src/patients/dto/get-patient-response.dto";
import { Patient } from "src/patients/entities/patient.entity";
import { right, left } from "src/errors/either";
import { randomUUID } from "node:crypto";

export class InMemoryPatientRepository implements PatientRepository {
  public patients: Patient[] = []

  async create(data: CreatePatientDto): Promise<void> {
    const { firstName, lastName, addresses, dateOfBirth, email, documentIds, phoneNumbers } = data

    if (!this.patients.find((patient) => patient.documentIds === documentIds)) {
      this.patients.push({
        id: randomUUID(),
        firstName,
        lastName,
        addresses,
        dateOfBirth,
        email: email ?? null,
        documentIds,
        phoneNumbers,
      });
    }
  }

  async getOne(data: GetPatientDto): Promise<GetPatientResponse> {
    // const patient = this.patients.find(
    //   (patient) =>
    //     patient.firstName === data.firstName &&
    //     patient.documentIds.find(
    //       (document) => document.number === data.documentId.number,
    //     ),
    // );
    const patient = this.patients.find(
      (patient) =>
        patient.documentIds.find(
          (document) => document.number === data.documentId.number,
        ),
    );
    if ((patient)) return right(patient)
    
    return left(new Error("Invalid credentials"));
  }

  async getAll(): Promise<Patient[]> {
    return this.patients
  }
}