import { Injectable } from "@nestjs/common";
import { PatientRepository } from "../patient-repository";
import { CreatePatientDto } from "src/patients/dto/create-patient.dto";
import { Patient } from "src/patients/entities/patient.entity";
import { GetPatientDto } from "src/patients/dto/get-patient-data.dto";
import { GetPatientResponse } from "src/patients/dto/get-patient-response.dto";
import { PrismaService } from "src/database/prisma.service";
import { right, left } from "src/errors/either";

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private prisma: PrismaService) {}
  
  async create(data: CreatePatientDto): Promise<Error | void> {
    const {
      firstName,
      lastName,
      addresses,
      dateOfBirth,
      email,
      documentIds,
      phoneNumbers,
    } = data;

    try {
      await this.prisma.patient.create({
        data: {
          firstName,
          lastName,
          addresses: {
            create: addresses,
          },
          dateOfBirth,
          email,
          documentIds: {
            create: documentIds,
          },
          phoneNumbers: {
            create: phoneNumbers,
          },
        },
      });
    } catch (error) {
      if (error.code == "P2002") throw new Error("DocumentId already exists");
      throw new Error(error);
    }
  }

  async getOne(data: GetPatientDto): Promise<GetPatientResponse> {
    try {
      const patient = await this.prisma.patient.findFirstOrThrow({
        where: {
          firstName: data.firstName,
          documentIds: {
            some: {
              number: data.documentId.number,
              type: data.documentId.type
            }
          }
        }, select: {
          id: false,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          email: true,
          addresses: {
            select: {
              state: true,
              city: true,
              street: true,
              zipCode: true
            }
          },
          documentIds: {
            select: {
              number: true,
              type: true
            }
          },
          phoneNumbers: {
            select: {
              number: true,
              type: true
            }
          }
        }
      })
      return right(patient)
    } catch (error) {
      if(error.code === "P2025") return left(new Error("Paciente não encontrado no sistema"))
      return left(error)
    }
  }

  async getAll(): Promise<Patient[]> {
    const patients = await this.prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        email: true,
        addresses: {
          select: {
            state: true,
            city: true,
            street: true,
            zipCode: true,
          },
        },
        documentIds: {
          select: {
            number: true,
            type: true,
          },
        },
        phoneNumbers: {
          select: {
            number: true,
            type: true,
          },
        },
      },
    });
    return patients
  }

  async delete(id: string): Promise<void> {
    try {
      await Promise.all([
        this.prisma.documentId.deleteMany({
          where: {
            patientId: id,
          },
        }),
        this.prisma.address.deleteMany({
          where: {
            patientId: id,
          },
        }),
        this.prisma.phoneNumber.deleteMany({
          where: {
            patientId: id,
          },
        }),
      ]);

      await this.prisma.patient.delete({
        where: {
          id
        }
      })
    } catch(error) {
      console.log(error)
    }
  }
}