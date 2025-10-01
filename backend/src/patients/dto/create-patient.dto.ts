import { IsDocumentValid, IsValidCEP, IsValidPhoneNumber } from "src/tools/custom-validation-decorators";
import { IAddress } from "./address.dto";
import { IDocumentId } from "./identification-document.dto";
import { IPhoneNumber } from "./phone-number.dto";
import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsArray, IsNotEmpty, ArrayNotEmpty, IsOptional,} from "class-validator"

export class CreatePatientDto {
  @ApiProperty({
    description: "Primeiro nome",
    example: "John",
  })
  @IsNotEmpty({ message: "firstName is required" })
  @IsString({ message: "firstName must be a string" })
  firstName: string;

  @ApiProperty({
    description: "Sobrenome",
    example: "Doe",
  })
  @IsNotEmpty({ message: "lastName is required" })
  @IsString({ message: "lastName must be a string" })
  lastName: string;

  @ApiProperty({
    description: "Endereços",
    example: [
      {
        state: "São Paulo",
        city: "São Paulo",
        street: "Rua 10 de janeiro",
        zipCode: "03011000",
      },
    ],
  })
  @IsNotEmpty({ message: "addresses is required" })
  @IsArray({ message: "addresses must be a array" })
  @ArrayNotEmpty({ message: "at least one address is required" })
  @IsValidCEP({ message: "invalid zipCode" })
  addresses: IAddress[];

  @ApiProperty({
    description: "Data de nascimento",
    example: new Date(10 / 10 / 2000),
  })
  @IsNotEmpty({ message: "dateOfBirth is required" })
  dateOfBirth: Date;

  @ApiProperty({
    nullable: true,
    description: "Email do paciente se houver",
    example: "emailx@gmail.com",
  })
  @IsOptional()
  @IsString({ message: "email must be a string" })
  email?: string;

  @ApiProperty({
    description:
      "Um ou mais documentos de identificação do paciente com seu respectivo tipo (cpf ou rg)",
    example: [
      {
        number: "065.548.339-30",
        type: "cpf",
      },
    ],
  })
  @IsNotEmpty({ message: "documentIds is required" })
  @IsArray({ message: "documentIds must be a array" })
  @ArrayNotEmpty({ message: "at least one documentId is required" })
  @IsDocumentValid()
  documentIds: IDocumentId[];

  @ApiProperty({
    description: "Um ou mais números de telefone para contato",
    example: [
      {
        number: "(44) 99131-6824",
        type: "work",
      },
    ],
  })
  @IsNotEmpty({ message: "phoneNumbers is required" })
  @IsArray({ message: "phoneNumbers must be a array" })
  @ArrayNotEmpty({ message: "at least one phoneNumber is required" })
  @IsValidPhoneNumber({ message: "invalid phoneNumbers" })
  phoneNumbers: IPhoneNumber[];
}
