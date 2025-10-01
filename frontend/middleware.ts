import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { JwtService } from "./app/services/jwt"

// Este é um middleware simples para simular autenticação
// Em um caso real, você verificaria um token JWT ou cookie de sessão

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("token");
  // Simula verificação de autenticação
  // Em um caso real, você verificaria um token JWT ou cookie de sessão

  const isLoginPage = request.nextUrl.pathname === "/login"

  // Se o usuário não está autenticado e não está na página de login, redireciona para login
  if (
    !isAuthenticated &&
    !isLoginPage &&
    !request.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se o usuário está autenticado e está tentando acessar a página de login, redireciona para dashboard
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configuração para aplicar o middleware apenas nas rotas especificadas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
