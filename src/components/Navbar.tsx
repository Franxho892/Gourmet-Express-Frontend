import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const esAdmin = usuario?.rol === "ADMIN";

  // Estado del contador del carrito
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  // Clave del carrito por usuario (cada usuario tiene su propio carrito)
  const claveAlmacen = useMemo(
    () => (usuario ? `gourmet_cart:${usuario.email}` : null),
    [usuario]
  );

  // Cargar la cantidad inicial del carrito
  useEffect(() => {
    if (!claveAlmacen) {
      setCantidadCarrito(0);
      return;
    }

    try {
      const raw = localStorage.getItem(claveAlmacen);
      if (raw) {
        const items = JSON.parse(raw);
        const total = items.reduce(
          (sum: number, item: any) => sum + item.qty,
          0
        );
        setCantidadCarrito(total);
      } else {
        setCantidadCarrito(0);
      }
    } catch {
      setCantidadCarrito(0);
    }
  }, [claveAlmacen]);

  // Escucha eventos globales de actualización del carrito
  useEffect(() => {
    const actualizar = () => {
      if (!claveAlmacen) {
        setCantidadCarrito(0);
        return;
      }

      try {
        const raw = localStorage.getItem(claveAlmacen);
        if (raw) {
          const items = JSON.parse(raw);
          const total = items.reduce(
            (sum: number, item: any) => sum + item.qty,
            0
          );
          setCantidadCarrito(total);
        } else {
          setCantidadCarrito(0);
        }
      } catch {
        setCantidadCarrito(0);
      }
    };

    window.addEventListener("carrito-actualizado", actualizar);

    return () => {
      window.removeEventListener("carrito-actualizado", actualizar);
    };
  }, [claveAlmacen]);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "blanchedalmond" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Gourmet Express</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">

          {/* Navegación izquierda */}
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/menu">Menu</Link>
            <Link className="nav-link" to="/reservar">Reservar</Link>

            {esAdmin && (
              <Link className="nav-link text-danger fw-bold" to="/admin">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Navegación derecha */}
          <div className="navbar-nav">
            {!usuario ? (
              <>
                <Link className="nav-link" to="/login">Ingresar</Link>
                <Link className="nav-link" to="/register">Registrarse</Link>
              </>
            ) : (
              <>
                <span className="navbar-text me-3">
                  Hola, {usuario.name}
                </span>

                <Link className="nav-link" to="/mis-reservas">
                  Mis Reservas
                </Link>

                {/* Carrito con contador */}
                <Link className="nav-link" to="/carrito">
                  Carrito {cantidadCarrito > 0 && `(${cantidadCarrito})`}
                </Link>

                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
