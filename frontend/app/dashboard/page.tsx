import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { PatientList } from "@/components/patient-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Patient } from "../types/Patient"

export const metadata: Metadata = {
  title: "Dashboard | Clinic Admin",
  description: "Clinic patient management dashboard",
}

const getPatients = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient/all`)
  const patients = await res.json()

  if (!Array.isArray(patients)) return []
  
  return patients
}

export const dynamic =  "force-dynamic"

export default async function DashboardPage() {
  const patients: Patient[] = await getPatients()

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">Gerencie os pacientes da sua clínica</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/patients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </div>
      <PatientList patients={patients} />
    </DashboardShell>
  )
}