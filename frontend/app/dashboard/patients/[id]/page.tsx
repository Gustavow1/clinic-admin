import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { PatientUpdateForm } from "@/components/patient-update-form"
import { getPatients } from "@/app/api/patient/get-patients"
import { Patient } from "@/app/types/Patient"
import { PageProps } from "@/.next/types/app/dashboard/patients/[id]/page"

export const metadata: Metadata = {
  title: "Editar Paciente | Clinic Admin",
  description: "Editar informações do paciente",
}

export default async function EditPatientPage({ params }: PageProps) {
  const { id } = await params
  const patients: Patient[] = await getPatients()
  const patient = patients.find((p) => p.id === id)
  if(patient == undefined) return
  
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Paciente</h2>
          <p className="text-muted-foreground">Atualize as informações do paciente</p>
        </div>
      </div>
      <PatientUpdateForm patient={patient} />
    </DashboardShell>
  )
}
