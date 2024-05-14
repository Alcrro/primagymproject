export async function getInformation() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/footer/informatii`,
    {
      cache: "force-cache",
    }
  );

  return res.json();
}
