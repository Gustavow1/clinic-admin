import type React from "react"
import type { Metadata } from "next"
import { SideNav } from "@/components/side-nav"

export const metadata: Metadata = {
  title: "Dashboard | Clinic Admin",
  description: "Clinic patient management dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <SideNav />
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
