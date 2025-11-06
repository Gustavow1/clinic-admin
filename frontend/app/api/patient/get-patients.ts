export const getPatients = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient/all`)
  const patients = await res.json()

  if (!Array.isArray(patients)) return []
  
  return patients
}