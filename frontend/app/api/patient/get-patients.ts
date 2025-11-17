"use server";

import { cookies } from "next/headers";

export const getPatients = async () => {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient/all`, {
    headers: {
      Authorization: `Bearer ${cookieStore.get("token")?.value}`,
    },
  });

  if (!res.ok) return [];

  const patients = await res.json();

  if (!Array.isArray(patients)) return [];

  return patients;
};
