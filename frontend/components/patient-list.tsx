"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react"
import Link from "next/link"
import { deletePatient } from "@/app/api/patient/delete-patient"
import { useRouter } from "next/navigation"

// Define types
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
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  email?: string
  addresses: Address[]
  documentIds: DocumentId[]
  phoneNumbers: PhoneNumber[]
}

export function PatientList({ patients }: { patients: Patient[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      patient.addresses.some(
        (addr) =>
          addr.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.state.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      patient.documentIds.some((doc) => doc.number.includes(searchTerm)) ||
      patient.phoneNumbers.some((phone) => phone.number.includes(searchTerm)),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Get primary document (CPF preferred)
  const getPrimaryDocument = (patient: Patient) => {
    const cpf = patient.documentIds.find((doc) => doc.type === "cpf")
    return cpf ? `CPF: ${cpf.number}` : patient.documentIds.length > 0 ? `RG: ${patient.documentIds[0].number}` : "-"
  }

  // Get primary phone
  const getPrimaryPhone = (patient: Patient) => {
    return patient.phoneNumbers.length > 0 ? patient.phoneNumbers[0].number : "-"
  }

  const removePatient = async (patient: Patient) => {
    await deletePatient(patient.id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pacientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Endereço Principal</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{getPrimaryDocument(patient)}</TableCell>
                  <TableCell>{getPrimaryPhone(patient)}</TableCell>
                  <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                  <TableCell>
                    {patient.addresses.length > 0 ? `${patient.addresses[0].city}, ${patient.addresses[0].state}` : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/patients/${patient.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <button onClick={() => removePatient(patient)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}