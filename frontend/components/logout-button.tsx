"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      router.push("/login")
      router.refresh() // Atualiza o estado da aplicação para refletir o logout
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Saindo..." : "Sair"}
    </Button>
  )
}
