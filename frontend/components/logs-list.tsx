"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

// Define o tipo para os logs conforme solicitado
type Log = {
  id: string
  requestTime: Date
  responseTime: Date
  method: string
  url: string
  statusCode: number
  userAgent: string | null
  body: any
  params: object | any
  query: object | any
}

export function LogsList({ logs }: { logs: Log[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({})

  const filteredLogs = logs.filter(
    (log) =>
      log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.statusCode.toString().includes(searchTerm),
  )

  // Formata data para exibição
  const formatDate = (date: Date) => {
    return date.toLocaleString()
  }

  // Calcula o tempo de resposta em milissegundos
  const calculateResponseTimeMs = (requestTime: Date, responseTime: Date) => {
    return `${new Date(responseTime).getTime() - new Date(requestTime).getTime()}ms`
  }

  // Obtém a classe CSS baseada no código de status
  const getStatusClass = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300)
      return "bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium"
    if (statusCode >= 300 && statusCode < 400)
      return "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium"
    if (statusCode >= 400 && statusCode < 500)
      return "bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium"
    if (statusCode >= 500) return "bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium"
    return "bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium"
  }

  // Obtém a classe CSS baseada no método HTTP
  const getMethodClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
      case "POST":
        return "bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium"
      case "DELETE":
        return "bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium"
      default:
        return "bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium"
    }
  }

  // Alterna a expansão de um log
  const toggleExpand = (logId: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }))
  }

  // Formata um objeto para exibição
  const formatObject = (obj: any) => {
    if (obj === null || obj === undefined) return "null"
    if (Object.keys(obj).length === 0) return "{}"

    return JSON.stringify(obj, null, 2)
  }

  // Verifica se um objeto tem conteúdo
  const hasContent = (obj: any) => {
    return obj !== null && obj !== undefined && Object.keys(obj).length > 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar logs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Method</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="hidden md:table-cell">User Agent</TableHead>
              <TableHead>Status Code</TableHead>
              <TableHead>Request Time</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <TableRow
                    key={log.id}
                    className={expandedLogs[log.id] ? "bg-muted/50" : ""}
                    onClick={() => toggleExpand(log.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="p-2">
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                        {expandedLogs[log.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className={getMethodClass(log.method)}>{log.method}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">{log.url}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate text-xs text-muted-foreground">
                      {log.userAgent || "-"}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusClass(log.statusCode)}>{log.statusCode}</span>
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(log.requestTime)}</TableCell>
                    <TableCell className="text-xs">{formatDate(log.responseTime)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {calculateResponseTimeMs(log.requestTime, log.responseTime)}
                    </TableCell>
                  </TableRow>
                  {expandedLogs[log.id] && (
                    <TableRow key={`${log.id}-expanded`} className="bg-muted/50">
                      <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Body</h4>
                            {hasContent(log.body) ? (
                              <pre className="text-xs bg-slate-950 text-slate-50 p-2 rounded-md overflow-auto max-h-60">
                                {formatObject(log.body)}
                              </pre>
                            ) : (
                              <p className="text-xs text-muted-foreground">Nenhum body</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Params</h4>
                            {hasContent(log.params) ? (
                              <pre className="text-xs bg-slate-950 text-slate-50 p-2 rounded-md overflow-auto max-h-60">
                                {formatObject(log.params)}
                              </pre>
                            ) : (
                              <p className="text-xs text-muted-foreground">Nenhum parâmetro</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Query</h4>
                            {hasContent(log.query) ? (
                              <pre className="text-xs bg-slate-950 text-slate-50 p-2 rounded-md overflow-auto max-h-60">
                                {formatObject(log.query)}
                              </pre>
                            ) : (
                              <p className="text-xs text-muted-foreground">Nenhuma query</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum log encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
