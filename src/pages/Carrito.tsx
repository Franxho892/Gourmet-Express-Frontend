import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ArticuloCarrito {
  id: string;
  titulo: string;
  precio: string; // almacenado como string "$x.xxx" para simplicidad
  img: string;
  qty: number;
}

function parsePrecioToNumber(precio: string): number {
  // Elimina símbolos y puntos: "$4.500" -> 4500
  const cleaned = precio.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
}

export default function Carrito() {
  const { usuario } = useAuth();
  const location = useLocation();
  const claveAlmacen = useMemo(() => (usuario ? `gourmet_cart:${usuario.email}` : null), [usuario]);
  const [articulos, setArticulos] = useState<ArticuloCarrito[]>([]);

  if (!usuario) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  useEffect(() => {
    if (!claveAlmacen) return;
    try {
      const raw = localStorage.getItem(claveAlmacen);
      setArticulos(raw ? JSON.parse(raw) : []);
    } catch {
      setArticulos([]);
    }
  }, [claveAlmacen]);

  const persistir = (next: ArticuloCarrito[]) => {
    if (!claveAlmacen) return;
    localStorage.setItem(claveAlmacen, JSON.stringify(next));
    setArticulos(next);
  };

  const aumentar = (id: string) => {
    const next = articulos.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
    persistir(next);
  };
  const disminuir = (id: string) => {
    const next = articulos
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
      .filter(Boolean) as ArticuloCarrito[];
    persistir(next);
  };
  const eliminarArticulo = (id: string) => {
    const ok = window.confirm("¿Eliminar del carrito?");
    if (!ok) return;
    const next = articulos.filter((i) => i.id !== id);
    persistir(next);
  };
  const vaciarTodo = () => {
    const ok = window.confirm("¿Vaciar carrito?");
    if (!ok) return;
    persistir([]);
  };

  const total = articulos.reduce((sum, i) => sum + parsePrecioToNumber(i.precio) * i.qty, 0);

  return (
    <div style={{ backgroundColor: "rgb(43,63,63)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container mt-4 p-3 p-md-4 rounded flex-grow-1">
        <h1 className="text-center mb-4">Mi Carrito</h1>
        {articulos.length === 0 ? (
          <div className="alert alert-info">Tu carrito está vacío.</div>
        ) : (
          <>
            <div className="row g-3">
              {articulos.map((i) => (
                <div className="col-12 col-md-6 col-lg-4" key={i.id}>
                  <div className="card h-100">
                    <img src={i.img} className="card-img-top" alt={i.titulo} />
                    <div className="card-body">
                      <h5 className="card-title">{i.titulo}</h5>
                      <p className="card-text mb-1">Precio: {i.precio}</p>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => disminuir(i.id)}>-</button>
                        <span>{i.qty}</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => aumentar(i.id)}>+</button>
                        <button className="btn btn-outline-danger btn-sm ms-auto" onClick={() => eliminarArticulo(i.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button className="btn btn-outline-danger" onClick={vaciarTodo}>Vaciar carrito</button>
              <div className="fs-5 fw-bold">Total: ${total.toLocaleString()}</div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}


