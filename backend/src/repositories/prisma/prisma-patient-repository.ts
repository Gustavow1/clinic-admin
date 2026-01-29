import { Injectable } from "@nestjs/common";
import { PatientRepository } from "../patient-repository";
import { CreatePatientDto } from "src/patients/dto/create-patient.dto";
import { Patient } from "src/patients/entities/patient.entity";
import { GetPatientDto } from "src/patients/dto/get-patient-data.dto";
import { GetPatientResponse } from "src/patients/dto/get-patient-response.dto";
import { PrismaService } from "src/database/prisma.service";
import { right, left } from "src/errors/either";
import { UpdatePatientDto } from "src/patients/dto/update-patient.dto";
import { DeletePatientResponse } from "src/patients/dto/delete-patient-response.dto";
import { UpdatePatientResponse } from "src/patients/dto/update-patient-response.dto";
import { CreatePatientResponse } from "src/patients/dto/create-patient-response.dto";
import { DocumentIdAlreadyExistsError } from "src/patients/errors/documentId-already-exists";
import { PatientNotFoundError } from "src/patients/errors/patient-not-found";
import { PatientIdNotFoundError } from "src/patients/errors/patient-id-not-found";
import { redisClient } from "src/services/redis/service";

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private prisma: PrismaService) {}
  
  async create(data: CreatePatientDto): Promise<CreatePatientResponse> {
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
      await redisClient.del("patients")
      return right("Patient created")
    } catch (error) {
      if (error.code == "P2002") return left(new DocumentIdAlreadyExistsError(data.documentIds));
      return left(error);
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
      if(error.code === "P2025") return left(new PatientNotFoundError(data.firstName))
      return left(error)
    }
  }

  async getAll(): Promise<Patient[]> {
    const cachedPatients = await redisClient.get("patients");
    if (cachedPatients) {
      return JSON.parse(cachedPatients) as Patient[];
    }
    const patients =
      await this.prisma.patient.findMany({
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
    await redisClient.set("patients", JSON.stringify(patients))
    return patients;
  }

  async delete(id: string): Promise<DeletePatientResponse> {
    try {

      await this.prisma.patient.findFirstOrThrow({
        where: {
        id
      }})

      await this.prisma.patient.delete({
        where: {
          id
        }
      })
      await redisClient.del("patients")
      return right("Patient successfully deleted")
    } catch (error) {
      if (error.code === "P2025") return left(new PatientIdNotFoundError(id));
      return left(error)
    }
  }

  async update(data: UpdatePatientDto): Promise<UpdatePatientResponse> {
    try {
      const patient = await this.prisma.patient.findFirstOrThrow({
        where: {
          id: data.id
        },
      })

      if (data.changedAreas.addresses) {
        await this.prisma.address.updateMany({
          where: {
            patientId: patient.id
          },
          data: data.addresses
        })
      }
      
      if (data.changedAreas.documentIds) {
        await this.prisma.documentId.updateMany({
          where: {
            patientId: data.id
          }, data: data.documentIds
        })
      }

      if (data.changedAreas.phoneNumbers) {
        await this.prisma.phoneNumber.updateMany({
          where: {
            patientId: data.id
          }, data: data.phoneNumbers
        })
      }

      if (data.changedAreas.email) {
        await this.prisma.patient.update({
          where: {
            id: patient.id,
          }, data: {
            email: data.email
          }
        })
      }
      await redisClient.del("patients")
      return right("Patient updated")
    } catch (error) {
      if (error.code === "P2025") return left(new PatientNotFoundError(data.firstName));
      return left(error)
    }
  }
}