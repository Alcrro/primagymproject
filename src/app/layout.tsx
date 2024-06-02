import type { Metadata } from "next";
import "./globals.scss";
import Navbar from "../components/navbar/Navbar";
import ThemeSwitch from "../app/ThemeSwitch";
import DarkThemeProviders from "./darkThemeProviders";
import Footer from "../components/footer/Footer";
import { Roboto } from "next/font/google";
import { ContextAPI } from "../context/contextAPI/ContextAPI";
import AddToCartProvider from "../context/addToCart/AddToCartContext";

export const metadata: Metadata = {
  title: "PrimaGym - Acasa",
  description: "Generated by alcrro",
  icons: {
    icon: "./public/logo/primaGymLogoOriginal.jpg",
  },
};
// If loading a variable font, you don't need to specify the font weight

const roboto = Roboto({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="./logo/primaGymLogoOriginal.jpg" sizes="any" />
      </head>
      <body>
        <ContextAPI>
          <AddToCartProvider>
            <DarkThemeProviders>
              <ThemeSwitch />

              <main className={`${roboto.className} relative`}>
                <Navbar />
                <div className="main">{children}</div>

                <Footer />
              </main>
            </DarkThemeProviders>
          </AddToCartProvider>
        </ContextAPI>
      </body>
    </html>
  );
}
