"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface IContextProps {
  pathname: string;
}

const ContextAPIProvider = createContext<any>({});

export const ContextAPI = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [onHoverActive, setHoverActive] = useState(false);
  const [active, setActive] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

  const [width, setWidth] = useState();

  const logoRef: React.MutableRefObject<HTMLLIElement | null> =
    useRef<HTMLLIElement | null>(null);

  const titleRef: React.MutableRefObject<HTMLLIElement | null> =
    useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const body = document.querySelector("body");
    if (pathname.endsWith("/")) {
      body?.classList.add("home");
    } else {
      body?.classList.remove("home");
    }
    if (pathname.startsWith("/admin")) {
      body?.classList.add("admin");
    } else {
      body?.classList.remove("admin");
    }
  }, [pathname]);

  const onHoverHandler = () => {
    if (onHoverActive) {
      setHoverActive((prev) => !prev);
    } else {
      setHoverActive((prev) => !prev);
    }
  };

  useLayoutEffect(() => {
    const container = document.querySelector(".navbar-container");

    const handleResize = () => {
      if (container && container.clientWidth >= 900) {
        setActive(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <ContextAPIProvider.Provider
      value={{
        pathname,
        logoRef,
        titleRef,
        onHoverActive,
        onHoverHandler,
        width,
        active,
        setActive,
        activeModal,
        setActiveModal,
      }}
    >
      {children}
    </ContextAPIProvider.Provider>
  );
};

export const useContextApi = () => useContext(ContextAPIProvider);
