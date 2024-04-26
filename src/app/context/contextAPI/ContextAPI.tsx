"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect } from "react";

interface IContextProps {}

const ContextAPIProvider = createContext<any>({});

export const ContextAPI = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.querySelector("body");
    if (pathname.endsWith("/")) {
      body?.classList.add("home");
    } else {
      body?.classList.remove("home");
    }
  }, [pathname]);
  return (
    <ContextAPIProvider.Provider value={{ pathname }}>
      {children}
    </ContextAPIProvider.Provider>
  );
};
