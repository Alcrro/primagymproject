"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import { logoutAction } from "@/app/actions/auth";
import type { UserRole } from "@/types/auth";
import "./pwaBottomNav.scss";

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface IPwaBottomNavClientProps {
  role: UserRole | null;
}

export default function PwaBottomNavClient({ role }: IPwaBottomNavClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { addToCart } = useAddToCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const cartCount = addToCart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const profileActive = isActive("/profil") || isActive("/admin") || isActive("/trainer");

  const handleProfileTab = () => {
    if (role) {
      setProfileOpen((p) => !p);
    } else {
      router.push("/login");
    }
  };

  const closePanel = () => setProfileOpen(false);

  return (
    <>
      {profileOpen && (
        <div className="pwa-profile-backdrop" onClick={closePanel} aria-hidden="true" />
      )}

      {profileOpen && (
        <div className="pwa-profile-panel">
          <div className="pwa-profile-handle" />

          <Link href="/profil" className="pwa-profile-item" onClick={closePanel}>
            <span>Profil</span>
            <IconChevronRight />
          </Link>

          <Link href="/profil/statistici" className="pwa-profile-item" onClick={closePanel}>
            <span>Statisticile mele</span>
            <IconChevronRight />
          </Link>

          {role === "ADMIN" && (
            <Link href="/admin" className="pwa-profile-item pwa-profile-item--admin" onClick={closePanel}>
              <span>Dashboard Admin</span>
              <IconChevronRight />
            </Link>
          )}

          {role === "TRAINER" && (
            <Link href="/trainer" className="pwa-profile-item pwa-profile-item--admin" onClick={closePanel}>
              <span>Dashboard Trainer</span>
              <IconChevronRight />
            </Link>
          )}

          <div className="pwa-profile-divider" />

          <form action={logoutAction}>
            <button type="submit" className="pwa-profile-item pwa-profile-item--logout">
              <span>Logout</span>
            </button>
          </form>
        </div>
      )}

      <nav className="pwa-bottom-nav" aria-label="Navigare PWA">
        <Link href="/" className={`pwa-nav-item${isActive("/") ? " active" : ""}`}>
          <span className="pwa-icon-pill"><IconHome /></span>
          <span className="pwa-label">Acasă</span>
        </Link>

        <Link href="/abonamente" className={`pwa-nav-item${isActive("/abonamente") ? " active" : ""}`}>
          <span className="pwa-icon-pill"><IconTag /></span>
          <span className="pwa-label">Abonamente</span>
        </Link>

        <Link href="/sesiuni" className={`pwa-nav-item${isActive("/sesiuni") ? " active" : ""}`}>
          <span className="pwa-icon-pill"><IconCalendar /></span>
          <span className="pwa-label">Sesiuni</span>
        </Link>

        <Link href="/cos" className={`pwa-nav-item${isActive("/cos") ? " active" : ""}`}>
          <span className="pwa-icon-pill">
            <IconCart />
            {cartCount > 0 && <span className="pwa-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
          </span>
          <span className="pwa-label">Coș</span>
        </Link>

        <button
          type="button"
          className={`pwa-nav-item${profileActive || profileOpen ? " active" : ""}`}
          onClick={handleProfileTab}
          aria-label="Profil"
        >
          <span className="pwa-icon-pill"><IconUser /></span>
          <span className="pwa-label">Profil</span>
        </button>
      </nav>
    </>
  );
}
