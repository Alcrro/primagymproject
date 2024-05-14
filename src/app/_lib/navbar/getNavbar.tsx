export default async function getNavbar() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/navbar`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return res.json();
}
