export async function getRules() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/footer/rules`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.json();
}
