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
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="v2-chevron">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
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
          <Link href="/locatii" className="v2-link">
            <IconPin /> Locații
          </Link>
          <Link href="/sesiuni" className="v2-link">
            <IconCalendar /> Sesiuni
          </Link>

          {locations.length <= 1 ? (
            <Link href="/antrenori" className="v2-link">
              <IconUsers /> Antrenori
            </Link>
          ) : (
            <div className="v2-dropdown-wrap">
              <Link href="/antrenori" className="v2-link v2-has-drop">
                <IconUsers /> Antrenori <ChevronDown />
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

          <div className="v2-dropdown-wrap">
            <Link href="/abonamente" className="v2-link v2-has-drop">
              <IconTag /> Abonamente <ChevronDown />
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

          <div className="v2-dropdown-wrap v2-cos-wrap">
            <Link href="/cos" className="v2-link v2-has-drop">
              <span className="v2-cart-icon">
                <IconCart />
                {cartCount > 0 && <span className="v2-badge">{cartCount}</span>}
              </span>
              Coș <ChevronDown />
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
                  <Image src={user.image} alt={user.name ?? "Profil"} width={32} height={32} className="v2-avatar-img" />
                ) : (
                  <span className="v2-avatar">{user.name?.[0]?.toUpperCase() ?? "U"}</span>
                )}
                {firstName && <span className="v2-user-name">{firstName}</span>}
                <ChevronDown />
              </div>
              <div className="v2-auth-dropdown">
                <Link href="/profil" className="v2-auth-item">Profil</Link>
                <Link href="/profil/statistici" className="v2-auth-item">Statisticile mele</Link>
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

          <button className="v2-hamburger" onClick={() => setMobileOpen((p) => !p)} aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}>
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="v2-mobile">
          <Link href="/locatii" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>
            <IconPin /> Locații
          </Link>
          <Link href="/sesiuni" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>
            <IconCalendar /> Sesiuni
          </Link>

          {locations.length <= 1 ? (
            <Link href="/antrenori" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>
              <IconUsers /> Antrenori
            </Link>
          ) : (
            <div className="v2-mobile-group">
              <span className="v2-mobile-label">Antrenori</span>
              {locations.map((loc) => (
                <Link key={loc.slug} href={`/antrenori/${loc.slug}`} className="v2-mobile-link v2-mobile-sub" onClick={() => setMobileOpen(false)}>
                  {loc.name}
                </Link>
              ))}
            </div>
          )}

          <div className="v2-mobile-group">
            <span className="v2-mobile-label">Abonamente</span>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/abonamente/${cat.slug}`} className="v2-mobile-link v2-mobile-sub" onClick={() => setMobileOpen(false)}>
                {cat.name}
              </Link>
            ))}
          </div>

          <Link href="/cos" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>
            <span className="v2-cart-icon">
              <IconCart />
              {cartCount > 0 && <span className="v2-badge">{cartCount}</span>}
            </span>
            Coș
          </Link>

          {user ? (
            <>
              <Link href="/profil" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>Profil</Link>
              <Link href="/profil/statistici" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>Statisticile mele</Link>
              <form action={logoutAction}>
                <button type="submit" className="v2-mobile-link">Logout</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="v2-mobile-link" onClick={() => setMobileOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </>
  );
}
