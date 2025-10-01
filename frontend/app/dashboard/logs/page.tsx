import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { LogsList } from "@/components/logs-list"
import { Log } from "@/app/types/Log"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Logs | Clinic Admin",
  description: "Logs do sistema da clínica",
}

const getLogs = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    })
    
    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error('Erro ao buscar logs:', error)
    return []
  }
}

export default async function LogsPage() {
  const logs: Log[] = await getLogs()

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Logs do Sistema</h2>
          <p className="text-muted-foreground">Visualize os logs de acesso e operações do sistema</p>
        </div>
      </div>
      <LogsList logs={logs}/>
    </DashboardShell>
  )
}
