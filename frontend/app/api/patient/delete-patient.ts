"use server"

import { cookies } from "next/headers";

export async function deletePatient(id: string) {
  const cookieStore = await cookies();

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookieStore.get("token")?.value}`,
    },
    body: JSON.stringify({
      id: id,
    }),
  });
}
