import { IsNotEmpty, IsString } from "class-validator";

export class DeletePatientDTO {
  @IsNotEmpty({ message: "id is required" })
  @IsString({ message: "id must be a string" })
  id: string;
}