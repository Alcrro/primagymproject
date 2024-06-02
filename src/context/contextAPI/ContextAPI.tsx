"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface IContextProps {
  logoRef: any;
  titleRef: any;
  width: number | null;
  pathname: string | undefined;
  onHoverActive: boolean;
  setHoverActive: Dispatch<SetStateAction<boolean>>;
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  activeModal: boolean;
  setActiveModal: Dispatch<SetStateAction<boolean>>;
  onHoverHandler: Dispatch<SetStateAction<void | undefined>>;
  shortActive: boolean;
  setShortActive: Dispatch<SetStateAction<boolean>>;
}

const ContextAPIProvider = createContext<IContextProps>({
  width: null,
  logoRef: null,
  titleRef: null,
  pathname: "",
  onHoverActive: false,
  setHoverActive: () => false,
  active: false,
  setActive: () => false,
  activeModal: false,
  setActiveModal: () => false,
  onHoverHandler: () => undefined,
  shortActive: false,
  setShortActive: () => false,
});

export const ContextAPI = ({ children }: { children: React.ReactNode }) => {
  const pathname: string = usePathname();
  const [onHoverActive, setHoverActive] = useState(false);
  const [shortActive, setShortActive] = useState(false);
  const [active, setActive] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

  const [width, setWidth] = useState<number | null>(null);

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
  }, [pathname]);

  const onHoverHandler = () => {
    if (onHoverActive) {
      setHoverActive((prev) => !prev);
    } else {
      setHoverActive((prev) => !prev);
    }
  };

  useLayoutEffect(() => {
    const container: any = document.querySelector(".navbar-container");
    const collapseActive =
      document.querySelector(".collapse-navbar-menu") || null;
    const menuContainer = document.querySelector(".menu-container.mobile");

    window?.addEventListener("resize", () => {
      if (container?.clientWidth >= 690) {
        setActive(false);
      } else {
      }
    });
  }, [width]);

  return (
    <ContextAPIProvider.Provider
      value={{
        pathname,
        logoRef,
        titleRef,
        onHoverActive,
        setHoverActive,
        onHoverHandler,
        width,
        active,
        setActive,
        activeModal,
        setActiveModal,
        shortActive,
        setShortActive,
      }}
    >
      {children}
    </ContextAPIProvider.Provider>
  );
};

export const useContextApi = () => useContext(ContextAPIProvider);
