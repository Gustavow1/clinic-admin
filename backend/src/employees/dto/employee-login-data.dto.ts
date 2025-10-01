import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
} from "class-validator";

export class EmployeeLoginData {
  @ApiProperty({ description: "Employee name", example: "John" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "Employee password", example: "password123" })
  @IsNotEmpty()
  @IsString()
  password: string;
}