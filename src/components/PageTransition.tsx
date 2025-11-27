import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // activa la animación justo después de montar
    const t = setTimeout(() => setActive(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`page-enter ${active ? "page-enter-active" : ""}`}>
      {children}
    </div>
  );
}
