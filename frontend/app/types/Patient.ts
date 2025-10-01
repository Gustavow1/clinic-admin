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

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  addresses: Address[];
  documentIds: DocumentId[];
  phoneNumbers: PhoneNumber[];
};
