import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { validateCEP, validateCPF, validatePhoneNumber } from "./utils";

export function IsDocumentValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isDocumentValid",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if(value === undefined) return false
          if (typeof value === "object" && value.type !== undefined && value.number !== undefined) {
            if (value.type.toLowerCase() === "cpf") return validateCPF(value.number)
            if (value.type.toLowerCase() === "rg") return true
            return false
          }
          if(Array.isArray(value) === false) return false
          value.forEach((document) => {
            if (
              document.type.toLowerCase() !== "cpf" ||
              document.type.toLowerCase() !== "rg"
            )
              return false;
            if (document.type.toLowerCase() === "cpf")
              return validateCPF(document.number);
          });
          return true;
        },
      },
    });
  };
}

export function IsValidCEP(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidCEP",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (Array.isArray(value) === false) return false;
          value.forEach((address) => {
            if (!validateCEP(address.zipCode)) return false;
          });
          return true;
        },
      },
    });
  };
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidPhoneNumber",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (Array.isArray(value) === false) return false;
          value.forEach((phoneNumber) => {
            if (!validatePhoneNumber(phoneNumber.number)) return false;
          });
          return true;
        },
      },
    });
  };
}