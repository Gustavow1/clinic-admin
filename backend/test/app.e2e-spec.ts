import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { redisClient } from "src/services/redis/service";
import { closeConnection } from "src/services/rabbitmq/rabbitmq.provider";
import { Patient } from "src/patients/entities/patient.entity";

describe("PatientController (e2e)", () => {
  let app: INestApplication<App>;
  let patientsArray: Patient[] = []

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it("/POST - Should create a new patient", async () => {
    const createPatientData = {
      firstName: "John",
      lastName: "Doe",
      addresses: [
        {
          street: "839 South Rockcrest Rd",
          city: "Oceanside",
          state: "CA",
          zipCode: "92056-452",
        },
      ],
      email: "emailtest@gmail.com",
      dateOfBirth: "2021-11-02T17:21:12.521Z",
      documentIds: [
        {
          number: "062.632.780-64",
          type: "cpf",
        },
      ],
      phoneNumbers: [
        {
          number: "(44) 99121-6124",
          type: "work",
        },
        {
          number: "(44) 99221-6682",
          type: "personal",
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post("/patient")
      .send(createPatientData);

    expect(response.status).toEqual(201);
    patientsArray.push(createPatientData);
  });

  it("/POST - Should fail to create patient due to duplicate document", async () => {
    const createPatientData = {
      firstName: "John",
      lastName: "Doe",
      addresses: [
        {
          street: "839 South Rockcrest Rd",
          city: "Oceanside",
          state: "CA",
          zipCode: "92056-452",
        },
      ],
      email: "emailtest@gmail.com",
      dateOfBirth: "2021-11-02T17:21:12.521Z",
      documentIds: [
        {
          number: "062.632.780-64",
          type: "cpf",
        },
      ],
      phoneNumbers: [
        {
          number: "(44) 99121-6124",
          type: "work",
        },
        {
          number: "(44) 99221-6682",
          type: "personal",
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post("/patient")
      .send(createPatientData);
    expect(response.status).toEqual(400);
    expect(response.body).toBe("DocumentId already exists");
  });

  it("/POST - Should fail to create patient due to incorrect document format", async () => {
    const createPatientData = {
      firstName: "John",
      lastName: "Doe",
      addresses: [
        {
          street: "839 South Rockcrest Rd",
          city: "Oceanside",
          state: "CA",
          zipCode: "92056-452",
        },
      ],
      email: "emailtest@gmail.com",
      dateOfBirth: "2021-11-02T17:21:12.521Z",
      documentIds: "062.632.780-64",
      phoneNumbers: [
        {
          number: "(44) 99121-6124",
          type: "work",
        },
        {
          number: "(44) 99221-6682",
          type: "personal",
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post("/patient")
      .send(createPatientData);
    expect(response.status).toEqual(400);
  });

  it("/GET - Should get a list with all patients", async () => {
    const response = await request(app.getHttpServer()).get("/patient/all");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(patientsArray);
  });

  it("/GET - Should get one patient", async () => {
    const response = await request(app.getHttpServer())
      .get("/patient")
      .send({
        firstName: "John",
        documentId: { number: "062.632.780-64", type: "cpf" },
      });
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      firstName: "John",
      lastName: "Doe",
      addresses: [
        {
          street: "839 South Rockcrest Rd",
          city: "Oceanside",
          state: "CA",
          zipCode: "92056-452",
        },
      ],
      email: "emailtest@gmail.com",
      dateOfBirth: "2021-11-02T17:21:12.521Z",
      documentIds: [
        {
          number: "062.632.780-64",
          type: "cpf",
        },
      ],
      phoneNumbers: [
        {
          number: "(44) 99121-6124",
          type: "work",
        },
        {
          number: "(44) 99221-6682",
          type: "personal",
        },
      ],
    });
  });

  it("/GET - Should fail to get one patient due to wrong name", async () => {
    const response = await request(app.getHttpServer())
      .get("/patient")
      .send({
        firstName: "Joseph",
        documentId: { number: "062.632.780-64", type: "cpf" },
      });
    expect(response.status).toEqual(400);
  });

  afterAll(async () => {
    await Promise.all([
      closeConnection(),
      redisClient.flushAll(),
      redisClient.del("patients"),
      redisClient.quit(),
      app.close(),
    ]);
  })
})