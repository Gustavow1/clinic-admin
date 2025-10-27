export async function deletePatient(id: string) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id
    }),
  });
}