"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
interface IProps {
  width: number;
  setWidth: Dispatch<SetStateAction<number>>;
}
const WidthContext = createContext<IProps>({
  width: 0,
  setWidth: () => 0,
});

export default function ResizableWidth({
  children,
}: {
  children: React.ReactNode;
}) {
  const [width, setWidth] = useState<number>(0);
  const pathname = usePathname();
  const route = useRouter();
  const pathN = pathname.split("/").slice(-1);

  useEffect(() => {
    if (pathN.toString() !== "galerie") {
      route.push(".");
    }
  });

  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <WidthContext.Provider value={{ width, setWidth }}>
      {children}
    </WidthContext.Provider>
  );
}

export const useWidthContext = () => useContext(WidthContext);
