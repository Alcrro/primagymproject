"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./navbarV2.scss";
import ApexFitLogo from "@/components/navbar/logo/ApexFitLogo";
import ThemeSwitch from "@/app/ThemeSwitch";
import CosNavbar from "@/components/navbar/cosNavbar/CosNavbar";
import MenuModal from "@/components/navbar/menuModal/MenuModal";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import { logoutAction } from "@/app/actions/auth";
import type { IAuthUser } from "@/types/auth";

interface INavbarV2Item {
  slug: string;
  name: string;
}

interface INavbarV2ClientProps {
  user: IAuthUser | null;
  categories: INavbarV2Item[];
  locations: INavbarV2Item[];
}

function ChevronDown() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="v2-chevron"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function NavbarV2Client({ user, categories, locations }: INavbarV2ClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { addToCart } = useAddToCart();
  const cartCount = addToCart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const firstName = user?.name?.split(" ")[0] ?? null;

  return (
    <>
      <div className="v2-inner">
        {/* Logo */}
        <Link href="/" className="v2-logo">
          <ApexFitLogo width={160} height={64} />
        </Link>

        {/* Nav links — desktop */}
        <nav className="v2-nav" aria-label="Navigare principală">
          <Link href="/locatii" className="v2-link">Locații</Link>
          <Link href="/sesiuni" className="v2-link">Sesiuni</Link>

          {/* Antrenori — link direct dacă e o singură locație, dropdown dacă sunt mai multe */}
          {locations.length <= 1 ? (
            <Link href="/antrenori" className="v2-link">Antrenori</Link>
          ) : (
            <div className="v2-dropdown-wrap">
              <Link href="/antrenori" className="v2-link v2-has-drop">
                Antrenori <ChevronDown />
              </Link>
              <MenuModal className="antrenori">
                <ul>
                  {locations.map((loc) => (
                    <li key={loc.slug}>
                      <Link href={`/antrenori/${loc.slug}`}>{loc.name}</Link>
                    </li>
                  ))}
                </ul>
              </MenuModal>
            </div>
          )}

          {/* Abonamente dropdown */}
          <div className="v2-dropdown-wrap">
            <Link href="/abonamente" className="v2-link v2-has-drop">
              Abonamente <ChevronDown />
            </Link>
            <MenuModal className="abonamente">
              <ul>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/abonamente/${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </MenuModal>
          </div>

          {/* Cos with badge + dropdown */}
          <div className="v2-dropdown-wrap v2-cos-wrap">
            <Link href="/cos" className="v2-link v2-has-drop">
              Cos
              {cartCount > 0 && <span className="v2-badge">{cartCount}</span>}
              <ChevronDown />
            </Link>
            {cartCount > 0 && <CosNavbar menu={{ link: "cos" }} />}
          </div>
        </nav>

        {/* Right: auth + theme + hamburger */}
        <div className="v2-actions">
          {user ? (
            <div className="v2-auth-wrap">
              <div className="v2-auth-trigger">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Profil"}
                    width={32}
                    height={32}
                    className="v2-avatar-img"
                  />
                ) : (
                  <span className="v2-avatar">{user.name?.[0]?.toUpperCase() ?? "U"}</span>
                )}
                {firstName && <span className="v2-user-name">{firstName}</span>}
                <ChevronDown />
              </div>
              <div className="v2-auth-dropdown">
                <Link href="/profil" className="v2-auth-item">Profil</Link>
                {user.role === "MEMBER" && (
                  <Link href="/rezervari" className="v2-auth-item">Rezervările mele</Link>
                )}
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="v2-auth-item v2-auth-item--admin">Dashboard Admin</Link>
                )}
                {user.role === "TRAINER" && (
                  <Link href="/trainer" className="v2-auth-item v2-auth-item--admin">Dashboard Trainer</Link>
                )}
                <form action={logoutAction}>
                  <button type="submit" className="v2-auth-item">Logout</button>
                </form>
              </div>
            </div>
          ) : (
            <Link href="/login" className="v2-login-btn">Login</Link>
          )}

          <div className="v2-auth-theme-sep" />
          <span className="v2-theme-wrap">
            <ThemeSwitch />
          </span>

          <button
            className="v2-hamburger"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="v2-mobile">
          <Link href="/locatii" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>Locații</Link>

          {locations.length <= 1 ? (
            <Link href="/antrenori" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>Antrenori</Link>
          ) : (
            <div className="v2-mobile-group">
              <span className="v2-mobile-label">Antrenori</span>
              {locations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/antrenori/${loc.slug}`}
                  className="v2-mobile-link v2-mobile-sub"
                  onClick={() => setMobileOpen(false)}
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          )}

          <div className="v2-mobile-group">
            <span className="v2-mobile-label">Abonamente</span>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/abonamente/${cat.slug}`}
                className="v2-mobile-link v2-mobile-sub"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <Link href="/cos" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>
            Cos
            {cartCount > 0 && <span className="v2-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <form action={logoutAction}>
              <button type="submit" className="v2-mobile-link">Logout</button>
            </form>
          ) : (
            <Link href="/login" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </>
  );
}
