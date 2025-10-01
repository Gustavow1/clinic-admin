"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, LayoutDashboard, Settings, FileText } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 flex flex-col h-screen py-6 pr-6 md:py-10">
      <div className="mb-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Clínica Admin</h2>
      </div>
      <div className="space-y-1">
        <Button asChild variant={pathname === "/dashboard" ? "default" : "ghost"} className="w-full justify-start">
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button
          asChild
          variant={pathname.includes("/dashboard/patients") ? "default" : "ghost"}
          className="w-full justify-start"
        >
        </Button>
        <Button
          asChild
          variant={pathname.includes("/dashboard/logs") ? "default" : "ghost"}
          className="w-full justify-start"
        >
          <Link href="/dashboard/logs">
            <FileText className="mr-2 h-4 w-4" />
            Logs
          </Link>
        </Button>
        {/* <Button
          asChild
          variant={pathname.includes("/dashboard/settings") ? "default" : "ghost"}
          className="w-full justify-start"
        >
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </Button> 
        Comentado para possibilidade de um uso no futuro. */}
      </div>

      {/* Espaçador flexível para empurrar o botão de logout para o final */}
      <div className="flex-grow"></div>

      {/* Botão de logout */}
      <div className="mt-4">
        <LogoutButton />
      </div>
    </nav>
  )
}
