"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePatient } from "@/app/api/patient/update-patient"

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
  dateOfBirth: string | Date
  email?: string
  addresses: Address[]
  documentIds: DocumentId[]
  phoneNumbers: PhoneNumber[]
}

type changedAreas = {
  email: boolean,
  addresses: boolean,
  documentIds: boolean,
  phoneNumbers: boolean
}

export function PatientUpdateForm({ patient }: { patient: Patient }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [changedAreas, setChangedAreas] = useState<changedAreas>({
    email: false,
    addresses: false,
    documentIds: false,
    phoneNumbers: false
  })

  // Set form state
  const [formData, setFormData] = useState({
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient?.email || "",
    dateOfBirth: new Date(patient.dateOfBirth),
    addresses: patient?.addresses || [
      {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ],
    documentIds: patient?.documentIds || [
      {
        number: "",
        type: "cpf" as const,
      },
    ],
    phoneNumbers: patient?.phoneNumbers || [
      {
        number: "",
        type: "Celular",
      },
    ],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    if (!changedAreas.email) {
      setChangedAreas((prev) => ({...prev, email: true}))
    }
  }

  // Handle address changes
  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)),
    }))

    // Clear error when field is edited
    const errorKey = `addresses.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
    if (!changedAreas.addresses) {
      setChangedAreas((prev) => ({...prev, adresses: true}))
    }
  }

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      ],
    }))
    if (!changedAreas.addresses) {
      setChangedAreas((prev) => ({...prev, adresses: true}))
    }
  }

  const removeAddress = (index: number) => {
    if (formData.addresses.length <= 1) {
      return // Prevent removing the last address
    }

    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }))
    if (!changedAreas.addresses) {
      setChangedAreas((prev) => ({...prev, adresses: true}))
    }

    // Clear any errors for this address
    setErrors((prev) => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`addresses.${index}`)) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  // Handle document changes
  const handleDocumentChange = (index: number, field: keyof DocumentId, value: any) => { 
    setFormData((prev) => ({
      ...prev,
      documentIds: prev.documentIds.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc)),
    }))

    if (!changedAreas.documentIds) {
      setChangedAreas((prev) => ({...prev, documentIds: true}))
    }

    // Clear error when field is edited
    const errorKey = `documentIds.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documentIds: [
        ...prev.documentIds,
        {
          number: "",
          type: "cpf" as const,
        },
      ],
    }))
    if (!changedAreas.documentIds) {
      setChangedAreas((prev) => ({...prev, documentIds: true}))
    }
  }

  const removeDocument = (index: number) => {
    if (formData.documentIds.length <= 1) {
      return // Prevent removing the last document
    }

    setFormData((prev) => ({
      ...prev,
      documentIds: prev.documentIds.filter((_, i) => i !== index),
    }))

    // Clear any errors for this document
    setErrors((prev) => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`documentIds.${index}`)) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
    if (!changedAreas.documentIds) {
      setChangedAreas((prev) => ({...prev, documentIds: true}))
    }
  }

  // Handle phone changes
  const handlePhoneChange = (index: number, field: keyof PhoneNumber, value: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => (i === index ? { ...phone, [field]: value } : phone)),
    }))

    // Clear error when field is edited
    const errorKey = `phoneNumbers.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
    if(!changedAreas.phoneNumbers) {
      setChangedAreas((prev) => ({...prev, phoneNumbers: true}))
    }
  }

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [
        ...prev.phoneNumbers,
        {
          number: "",
          type: "Celular",
        },
      ],
    }))
    if(!changedAreas.phoneNumbers) {
      setChangedAreas((prev) => ({...prev, phoneNumbers: true}))
    }
  }

  const removePhone = (index: number) => {
    if (formData.phoneNumbers.length <= 1) {
      return // Prevent removing the last phone
    }

    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
    }))

    // Clear any errors for this phone
    setErrors((prev) => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`phoneNumbers.${index}`)) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
    if(!changedAreas.phoneNumbers) {
      setChangedAreas((prev) => ({...prev, phoneNumbers: true}))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "Nome deve ter pelo menos 2 caracteres."
    }

    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Sobrenome deve ter pelo menos 2 caracteres."
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido."
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Data de nascimento é obrigatória."
    }

    // Validate each address
    formData.addresses.forEach((addr, index) => {
      if (!addr.street) {
        newErrors[`addresses.${index}.street`] = "Rua é obrigatória."
      }
      if (!addr.city) {
        newErrors[`addresses.${index}.city`] = "Cidade é obrigatória."
      }
      if (!addr.state) {
        newErrors[`addresses.${index}.state`] = "Estado é obrigatório."
      }
      if (!addr.zipCode) {
        newErrors[`addresses.${index}.zipCode`] = "CEP é obrigatório."
      }
    })

    // Validate each document
    formData.documentIds.forEach((doc, index) => {
      if (!doc.number) {
        newErrors[`documentIds.${index}.number`] = "Número do documento é obrigatório."
      }
      if (doc.type === "cpf" && !validateCPF(doc.number)) {
        newErrors[`documentIds.${index}.number`] = "CPF inválido."
      }
    })

    // Validate each phone
    formData.phoneNumbers.forEach((phone, index) => {
      if (!phone.number) {
        newErrors[`phoneNumbers.${index}.number`] = "Número de telefone é obrigatório."
      }
      if (!phone.type) {
        newErrors[`phoneNumbers.${index}.type`] = "Tipo de telefone é obrigatório."
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Simple CPF validation (just checks length for demo purposes)
  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, "")
    return cleanCPF.length === 11
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    updatePatient(formData, changedAreas).then(() => {
      setIsLoading(false)
      router.push("/dashboard")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Paciente</CardTitle>
        <CardDescription>Preencha os dados do paciente nos campos abaixo.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados Pessoais</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nome
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Nome"
                  readOnly
                  defaultValue={formData.firstName}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sobrenome
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Sobrenome"
                  readOnly
                  defaultValue={formData.lastName}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Data de Nascimento
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  readOnly
                  defaultValue={`${formData.dateOfBirth.getDate()}/${formData.dateOfBirth.getMonth()}/${formData.dateOfBirth.getFullYear()}`}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email (opcional)
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Documentos</h3>
              <Button type="button" variant="outline" size="sm" onClick={addDocument}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Documento
              </Button>
            </div>

            {formData.documentIds.map((document, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Documento {index + 1}</h4>
                  {formData.documentIds.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover documento</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`document-type-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tipo
                    </label>
                    <Select
                      value={document.type}
                      onValueChange={(value) => handleDocumentChange(index, "type", value as "cpf" | "rg")}
                    >
                      <SelectTrigger id={`document-type-${index}`}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="rg">RG</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors[`documentIds.${index}.type`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`documentIds.${index}.type`]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`document-number-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Número
                    </label>
                    <Input
                      id={`document-number-${index}`}
                      placeholder={document.type === "cpf" ? "000.000.000-00" : "00.000.000-0"}
                      value={document.number}
                      onChange={(e) => handleDocumentChange(index, "number", e.target.value)}
                      className={errors[`documentIds.${index}.number`] ? "border-red-500" : ""}
                    />
                    {errors[`documentIds.${index}.number`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`documentIds.${index}.number`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phone Numbers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Telefones</h3>
              <Button type="button" variant="outline" size="sm" onClick={addPhone}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Telefone
              </Button>
            </div>

            {formData.phoneNumbers.map((phone, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Telefone {index + 1}</h4>
                  {formData.phoneNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePhone(index)}
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover telefone</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`phone-type-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tipo
                    </label>
                    <Input
                      id={`phone-type-${index}`}
                      placeholder="Celular, Residencial, Trabalho, etc."
                      value={phone.type}
                      onChange={(e) => handlePhoneChange(index, "type", e.target.value)}
                      className={errors[`phoneNumbers.${index}.type`] ? "border-red-500" : ""}
                    />
                    {errors[`phoneNumbers.${index}.type`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`phoneNumbers.${index}.type`]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`phone-number-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Número
                    </label>
                    <Input
                      id={`phone-number-${index}`}
                      placeholder="(00) 00000-0000"
                      value={phone.number}
                      onChange={(e) => handlePhoneChange(index, "number", e.target.value)}
                      className={errors[`phoneNumbers.${index}.number`] ? "border-red-500" : ""}
                    />
                    {errors[`phoneNumbers.${index}.number`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`phoneNumbers.${index}.number`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Endereços</h3>
              <Button type="button" variant="outline" size="sm" onClick={addAddress}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Endereço
              </Button>
            </div>

            {formData.addresses.map((address, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Endereço {index + 1}</h4>
                  {formData.addresses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddress(index)}
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover endereço</span>
                    </Button>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`street-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Rua
                  </label>
                  <Input
                    id={`street-${index}`}
                    placeholder="Rua, número, complemento"
                    value={address.street}
                    onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                    className={errors[`addresses.${index}.street`] ? "border-red-500" : ""}
                  />
                  {errors[`addresses.${index}.street`] && (
                    <p className="text-sm text-red-500 mt-1">{errors[`addresses.${index}.street`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor={`city-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Cidade
                    </label>
                    <Input
                      id={`city-${index}`}
                      placeholder="Cidade"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                      className={errors[`addresses.${index}.city`] ? "border-red-500" : ""}
                    />
                    {errors[`addresses.${index}.city`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`addresses.${index}.city`]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`state-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Estado
                    </label>
                    <Input
                      id={`state-${index}`}
                      placeholder="UF"
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                      className={errors[`addresses.${index}.state`] ? "border-red-500" : ""}
                    />
                    {errors[`addresses.${index}.state`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`addresses.${index}.state`]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`zipCode-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      CEP
                    </label>
                    <Input
                      id={`zipCode-${index}`}
                      placeholder="00000-000"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange(index, "zipCode", e.target.value)}
                      className={errors[`addresses.${index}.zipCode`] ? "border-red-500" : ""}
                    />
                    {errors[`addresses.${index}.zipCode`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`addresses.${index}.zipCode`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard")} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
