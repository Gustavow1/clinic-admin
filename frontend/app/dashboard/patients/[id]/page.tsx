import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { PatientForm } from "@/components/patient-form"

export const metadata: Metadata = {
  title: "Editar Paciente | Clinic Admin",
  description: "Editar informações do paciente",
}

export default function EditPatientPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Paciente</h2>
          <p className="text-muted-foreground">Atualize as informações do paciente</p>
        </div>
      </div>
      <PatientForm patientId={params.id} />
    </DashboardShell>
  )
}
