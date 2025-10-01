import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
} from "class-validator";

export class AuthData {
  @ApiProperty({ description: "apiKey for authentication", example: "IKDQNWDDHYMA" })
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}