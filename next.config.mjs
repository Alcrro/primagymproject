/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" },
  // env: { NEXT_PUBLIC_API_URL: "http://0.0.0.0:3000" },
  // env: { NEXT_PUBLIC_API_URL: "https://primagym.lucruri-utile.ro" },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "https", hostname: "p16-sign.tiktokcdn-us.com" },
      { protocol: "https", hostname: "p16-sign-va.tiktokcdn.com" },
    ],
  },
};

export default nextConfig;
