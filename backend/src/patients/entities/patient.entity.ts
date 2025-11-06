import { IAddress } from "../dto/address.dto";
import { IDocumentId } from "../dto/identification-document.dto";
import { IPhoneNumber } from "../dto/phone-number.dto";

export class Patient {
  id: string;
  firstName: string;
  lastName: string;
  addresses: IAddress[];
  dateOfBirth: Date | string;
  email: string | null;
  documentIds: IDocumentId[];
  phoneNumbers: IPhoneNumber[]; 
}