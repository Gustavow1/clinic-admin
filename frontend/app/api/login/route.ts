import { JwtService } from "@/app/services/jwt"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, password } = body
    const cookieStore = await cookies()

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password
      }),
    })
    if(req.status === 400) throw new Error("Login failed")

    const { token } = await req.json();

    const tokenIsVerified = JwtService.verifyToken(token)

    if (token && tokenIsVerified) {
      cookieStore.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Nome de usuário ou senha incorretos." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, error: "Ocorreu um erro ao processar a solicitação." }, { status: 500 })
  }
}
