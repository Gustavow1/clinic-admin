

type Address = {
  street: string
  city: string
  state: string
  zipCode: string
}

type DocumentId = {
  number: string
  type: "cpf" | "rg"
}

type PhoneNumber = {
  number: string
  type: string
}

type Patient = {
  id?: string
  firstName: string
  lastName: string
  dateOfBirth: string | Date
  email?: string
  addresses: Address[]
  documentIds: DocumentId[]
  phoneNumbers: PhoneNumber[]
}

export async function createPatient(patient: Patient) {
  const {
    firstName,
    lastName,
    addresses,
    dateOfBirth,
    email,
    documentIds,
    phoneNumbers,
  } = patient;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      addresses,
      dateOfBirth: new Date(dateOfBirth),
      email: email ?? null,
      documentIds,
      phoneNumbers,
    }),
  });
}