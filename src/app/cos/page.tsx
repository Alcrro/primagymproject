import Cart from "@/components/cart/Cart";
import { auth } from "@/auth";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coș de cumpărături',
  description: 'Finalizează comanda abonamentului tău la ApexFit Bacău.',
};

export default async function page() {
  const session = await auth();
  return (
    <div className="cart-container">
      <Cart isLoggedIn={!!session?.user} />
    </div>
  );
}
