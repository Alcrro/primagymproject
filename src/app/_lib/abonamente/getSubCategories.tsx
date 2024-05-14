export async function getSubCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abonamente`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return res.json();
}
