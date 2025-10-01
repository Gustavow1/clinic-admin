import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { IDocumentId } from "./identification-document.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsDocumentValid } from "src/tools/custom-validation-decorators";

export class GetPatientDto {
  @ApiProperty({
    description: "Primeiro nome do paciente",
    example: "John",
  })
  @IsNotEmpty({ message: "firstName is required" })
  @IsString({ message: "firstName must be a string" })
  firstName: string;

  @ApiProperty({
    description: "Documento de identificação do paciente",
    example: {
      number: "091.688.900-95",
      type: "cpf",
    },
  })
  @IsNotEmpty({ message: "documentId is required" })
  @IsObject({ message: "documentId must be a valid object" })
  @IsDocumentValid({ message: "some documentId field is empty or documentId is not valid" })
  documentId: IDocumentId;
}