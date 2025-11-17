import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeletePatientDTO {
  @ApiProperty({
    description: "patient id",
    example: "896449d9-ece7-40fc-9a92-c44f2143e3cf",
  })
  @IsNotEmpty({ message: "id is required" })
  @IsString({ message: "id must be a string" })
  id: string;
}