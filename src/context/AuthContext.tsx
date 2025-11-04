import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface UsuarioAuth {
  name: string;
  email: string;
}

interface ValorContextoAuth {
  usuario: UsuarioAuth | null;
  registrar: (name: string, email: string, password: string) => Promise<string | null>;
  iniciarSesion: (email: string, password: string) => Promise<string | null>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<ValorContextoAuth | undefined>(undefined);

const USERS_KEY = "gourmet_users"; // array de usuarios {name,email,passwordHash}
const SESSION_KEY = "gourmet_session"; // {name,email}

function hashPassword(input: string): string {
  // Hash simple no-crypto para demo (NO usar en producción)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return String(hash);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUsuario(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const iniciarSesion = async (email: string, password: string): Promise<string | null> => {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<{ name: string; email: string; passwordHash: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return "Usuario no encontrado";
    if (found.passwordHash !== hashPassword(password)) return "Contraseña incorrecta";
    const session = { name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUsuario(session);
    return null;
  };

  const registrar = async (name: string, email: string, password: string): Promise<string | null> => {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<{ name: string; email: string; passwordHash: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return "El email ya está registrado";
    users.push({ name: name.trim(), email: email.trim(), passwordHash: hashPassword(password) });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const session = { name: name.trim(), email: email.trim() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUsuario(session);
    return null;
  };

  const cerrarSesion = () => {
    localStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  };

  const value = useMemo(() => ({ usuario, iniciarSesion, registrar, cerrarSesion }), [usuario]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): ValorContextoAuth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}


