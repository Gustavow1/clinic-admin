import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login | Clinic Admin",
  description: "Faça login para acessar o sistema da clínica",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Clínica Admin</h1>
          <p className="mt-2 text-sm text-gray-600">Faça login para acessar o sistema de gerenciamento da clínica</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
