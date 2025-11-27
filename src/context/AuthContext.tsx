import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axiosClient from "../api/axiosClient";

export interface UsuarioAuth {
  name: string;
  email: string;
  rol: string;
}

interface ValorContextoAuth {
  usuario: UsuarioAuth | null;
  registrar: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  iniciarSesion: (
    email: string,
    password: string
  ) => Promise<string | null>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<ValorContextoAuth | undefined>(undefined);

const SESSION_KEY = "gourmet_session"; // {name,email,rol}
const TOKEN_KEY = "token"; // JWT del backend

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UsuarioAuth;
        setUsuario(parsed);
      }
    } catch {
      // ignorar errores de parseo
    }
  }, []);

  const iniciarSesion = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    try {
      const resp = await axiosClient.post<{
        token: string;
        nombre: string;
        email: string;
        rol: string;
      }>("http://localhost:8082/auth/login", {
        email,
        password,
      });

      const { token, nombre, email: emailResp, rol } = resp.data;

      // Guardar token para que axiosClient lo mande en Authorization
      localStorage.setItem(TOKEN_KEY, token);

      const session: UsuarioAuth = {
        name: nombre,
        email: emailResp,
        rol,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUsuario(session);

      return null; // sin error
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        return "Credenciales inválidas";
      }
      return "Error al iniciar sesión. Intenta nuevamente.";
    }
  };

  const registrar = async (
    name: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    try {
      // Registrar usuario en el backend
      await axiosClient.post("http://localhost:8082/auth/register", {
        nombre: name.trim(),
        email: email.trim(),
        password,
        rol: "USER",
      });

      // Después de registrar, iniciamos sesión automáticamente
      return await iniciarSesion(email, password);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400 || status === 409) {
        const msgBackend = err?.response?.data;
        if (typeof msgBackend === "string") return msgBackend;
        return "El email ya está registrado o los datos no son válidos.";
      }
      return "Error al registrar. Intenta nuevamente.";
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
  };

  const value = useMemo(
    () => ({
      usuario,
      iniciarSesion,
      registrar,
      cerrarSesion,
    }),
    [usuario]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): ValorContextoAuth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
