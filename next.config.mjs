/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" },
  // env: { NEXT_PUBLIC_API_URL: "http://0.0.0.0:3000" },
  // env: { NEXT_PUBLIC_API_URL: "https://primagym.lucruri-utile.ro" },
  reactStrictMode: true,
  headers: {
    // "Referrer-Policy": "strict-origin",
  },
};

export default nextConfig;
