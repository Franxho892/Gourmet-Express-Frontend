import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

interface ReservaItem {
  id: string;
  fecha: string;
  hora: string;
  personas: string;
  createdAt: number;
}

export default function MisReservas() {
  const { usuario } = useAuth();
  const claveAlmacen = useMemo(() => (usuario ? `gourmet_reservations:${usuario.email}` : null), [usuario]);
  const [reservas, setReservas] = useState<ReservaItem[]>([]);

  useEffect(() => {
    if (!claveAlmacen) {
      setReservas([]);
      return;
    }
    try {
      const raw = localStorage.getItem(claveAlmacen);
      setReservas(raw ? JSON.parse(raw) : []);
    } catch {
      setReservas([]);
    }
  }, [claveAlmacen]);

  const cancelarReserva = (id: string) => {
    if (!claveAlmacen) return;
    const ok = window.confirm("¿Desea cancelar esta reserva?");
    if (!ok) return;
    const next = reservas.filter((r) => r.id !== id);
    localStorage.setItem(claveAlmacen, JSON.stringify(next));
    setReservas(next);
  };

  return (
    <div style={{ backgroundColor: "rgb(43,63,63)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container mt-4 p-3 p-md-4 rounded flex-grow-1">
        <h1 className="text-center mb-4">Mis Reservas</h1>
        {!usuario ? (
          <div className="alert alert-warning">Debes iniciar sesión para ver tus reservas.</div>
        ) : reservas.length === 0 ? (
          <div className="alert alert-info">No tienes reservas registradas.</div>
        ) : (
          <div className="row g-3">
            {reservas.map((r) => (
              <div className="col-12 col-md-6 col-lg-4" key={r.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{r.fecha} - {r.hora}</h5>
                    <p className="card-text">Personas: {r.personas}</p>
                    <p className="card-text"><small className="text-muted">Creada: {new Date(r.createdAt).toLocaleString()}</small></p>
                  </div>
                  <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => cancelarReserva(r.id)}>
                      Cancelar reserva
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


