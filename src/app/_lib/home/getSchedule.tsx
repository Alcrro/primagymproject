export default async function getSchedule() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule`, {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
 
    },
  });
  return res.json();
}
