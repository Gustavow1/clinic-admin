import { fi } from "date-fns/locale";

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

type DocumentId = {
  number: string;
  type: "cpf" | "rg";
};

type PhoneNumber = {
  number: string;
  type: string;
};

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  email?: string;
  addresses: Address[];
  documentIds: DocumentId[];
  phoneNumbers: PhoneNumber[];
};

type ChangedAreas = {
  email: boolean;
  addresses: boolean;
  documentIds: boolean;
  phoneNumbers: boolean;
};

export async function updatePatient(patient: Patient, changedAreas: ChangedAreas): Promise<void> {
  const {
    id,
    firstName,
    lastName,
    addresses,
    email,
    dateOfBirth,
    documentIds,
    phoneNumbers,
  } = patient;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      firstName,
      lastName,
      addresses,
      email,
      dateOfBirth,
      documentIds,
      phoneNumbers,
      changedAreas
    }),
  });
}
