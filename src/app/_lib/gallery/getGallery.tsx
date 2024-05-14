export async function getGallery() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.json();
}
