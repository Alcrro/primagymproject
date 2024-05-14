import React, { Suspense } from "react";
import "./navbar.scss";
import NavbarModal from "./NavbarModal";
import getNavbar from "@/app/_lib/navbar/getNavbar";

export default async function Navbar() {
  const navbar = await getNavbar();

  return (
    <nav className="nav navbar-container">
      <Suspense fallback={<p>Loading</p>}>
        <NavbarModal menu={navbar} />
      </Suspense>
    </nav>
  );
}
