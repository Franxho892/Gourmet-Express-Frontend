import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import PageTransition from "../components/PageTransition";

interface ArticuloCarrito {
  id: string;
  titulo: string;
  precio: string;
  img: string;
  qty: number;
}

// "$4.500" -> 4500
function parsePrecioToNumber(precio: string): number {
  const cleaned = precio.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
}

export default function Carrito() {
  const { usuario } = useAuth();
  const location = useLocation();

  const claveAlmacen = useMemo(
    () => (usuario ? `gourmet_cart:${usuario.email}` : null),
    [usuario]
  );

  const [articulos, setArticulos] = useState<ArticuloCarrito[]>([]);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");

  if (!usuario) {
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
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
    const next = articulos.map((i) =>
      i.id === id ? { ...i, qty: i.qty + 1 } : i
    );
    persistir(next);
  };

  const disminuir = (id: string) => {
    const next = articulos
      .map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      )
      .filter(Boolean) as ArticuloCarrito[];
    persistir(next);
  };

  const eliminarArticulo = (id: string) => {
    if (!window.confirm("¿Eliminar del carrito?")) return;
    persistir(articulos.filter((i) => i.id !== id));
  };

  const vaciarTodo = () => {
    if (!window.confirm("¿Vaciar carrito?")) return;
    persistir([]);
  };

  const total = articulos.reduce(
    (sum, i) => sum + parsePrecioToNumber(i.precio) * i.qty,
    0
  );

  const handlePagar = async () => {
    if (total <= 0) return;

    setCargandoPago(true);
    setMensaje(null);

    try {
      const respuesta = await axiosClient.post(
        "http://localhost:8083/pagos",
        {
          monto: total,
          metodoPago: metodoPago,
        }
      );

      setMensaje(`Pago realizado. ID: ${respuesta.data.id}`);
      persistir([]);
    } catch (error) {
      console.error(error);
      setMensaje("Error al procesar el pago.");
    } finally {
      setCargandoPago(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(43,63,63)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "30px 0",
        }}
      >
        <PageTransition>
          <div
            style={{
              width: "95%",
              maxWidth: "1100px",
              backgroundColor: "#f9ecd1",
              borderRadius: "24px",
              padding: "30px 25px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            <header className="mb-4 text-center text-md-start">
              <h1 className="mb-2" style={{ fontWeight: 800 }}>
                Mi Carrito
              </h1>
              <p className="mb-0" style={{ color: "rgb(43,63,63)" }}>
                Revisa tus productos antes de confirmar el pago. Puedes ajustar
                cantidades o eliminar platos si lo necesitas.
              </p>
            </header>

            {mensaje && (
              <div className="alert alert-info text-center">{mensaje}</div>
            )}

            {articulos.length === 0 ? (
              <div className="alert alert-warning text-center mt-3">
                Tu carrito está vacío. Ve al menú y agrega tus platos favoritos.
              </div>
            ) : (
              <div className="row g-4 align-items-start">
                {/* LISTA DE PRODUCTOS */}
                <div className="col-12 col-lg-8">
                  {articulos.map((i) => (
                    <div key={i.id} style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "18px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          padding: "14px 18px",
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                          maxWidth: "700px",
                          margin: "0 auto",
                        }}
                      >
                        {/* Imagen rectangular bien visible */}
                        <img
                          src={i.img}
                          alt={i.titulo}
                          style={{
                            width: "140px",
                            height: "110px",
                            borderRadius: "14px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />

                        {/* Info */}
                        <div style={{ flexGrow: 1 }}>
                          <h5
                            style={{
                              fontWeight: 700,
                              marginBottom: "4px",
                            }}
                          >
                            {i.titulo}
                          </h5>
                          <p
                            style={{
                              marginBottom: "6px",
                              fontSize: "0.9rem",
                            }}
                          >
                            Precio unitario: {i.precio}
                          </p>

                          <div className="d-flex align-items-center gap-2 mb-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => disminuir(i.id)}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 600 }}>{i.qty}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => aumentar(i.id)}
                            >
                              +
                            </button>

                            <span className="ms-auto fw-bold">
                              Subtotal: $
                              {(
                                parsePrecioToNumber(i.precio) * i.qty
                              ).toLocaleString()}
                            </span>
                          </div>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => eliminarArticulo(i.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RESUMEN DE PAGO */}
                <div className="col-12 col-lg-4">
                  <div
                    className="card border-0"
                    style={{
                      borderRadius: "18px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      backgroundColor: "#fff",
                      position: "sticky",
                      top: "20px",
                      width: "100%",
                      maxWidth: "680px",
                    }}
                  >
                    <div className="card-body">
                      <h4 className="mb-3" style={{ fontWeight: 700 }}>
                        Resumen de pago
                      </h4>

                      <div className="mb-3">
                        <label className="form-label">Método de pago</label>
                        <select
                          className="form-select"
                          value={metodoPago}
                          onChange={(e) => setMetodoPago(e.target.value)}
                        >
                          <option value="EFECTIVO">Efectivo</option>
                          <option value="DEBITO">Débito</option>
                          <option value="CREDITO">Crédito</option>
                          <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between mb-2">
                        <span>Productos:</span>
                        <span>{articulos.length}</span>
                      </div>

                      <div className="d-flex justify-content-between mb-3">
                        <span className="fw-bold">Total a pagar:</span>
                        <span className="fw-bold">
                          ${total.toLocaleString()}
                        </span>
                      </div>

                      <button
                        className="btn btn-success w-100 mb-2"
                        onClick={handlePagar}
                        disabled={cargandoPago || total === 0}
                      >
                        {cargandoPago ? "Procesando..." : "Confirmar pago"}
                      </button>

                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={vaciarTodo}
                      >
                        Vaciar carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
