import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { PatientForm } from "@/components/patient-form"

export const metadata: Metadata = {
  title: "Novo Paciente | Clinic Admin",
  description: "Adicionar novo paciente",
}

export default function NewPatientPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Novo Paciente</h2>
          <p className="text-muted-foreground">Adicione um novo paciente ao sistema</p>
        </div>
      </div>
      <PatientForm />
    </DashboardShell>
  )
}
