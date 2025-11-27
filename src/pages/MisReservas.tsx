import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import PageTransition from "../components/PageTransition";

interface ReservaItem {
  id: string | number;
  fecha: string;
  hora: string;
  personas: number;
  status?: string;
  createdAt: number;
}

export default function MisReservas() {
  const { usuario } = useAuth();
  const claveAlmacen = useMemo(
    () => (usuario ? `gourmet_reservations:${usuario.email}` : null),
    [usuario]
  );

  const [reservas, setReservas] = useState<ReservaItem[]>([]);

  useEffect(() => {
    if (!claveAlmacen) {
      setReservas([]);
      return;
    }
    try {
      const raw = localStorage.getItem(claveAlmacen);
      const parsed = raw ? JSON.parse(raw) : [];
      setReservas(Array.isArray(parsed) ? parsed : []);
    } catch {
      setReservas([]);
    }
  }, [claveAlmacen]);

  const cancelarReserva = async (id: string | number) => {
    if (!claveAlmacen) return;

    if (!window.confirm("¿Deseas cancelar esta reserva?")) return;

    try {
      await axiosClient.delete(`http://localhost:8080/reservas/${id}`);
    } catch (error) {
      console.error("Error al eliminar en backend", error);
      alert(
        "Hubo un problema eliminando la reserva en el sistema, pero se cancelará localmente."
      );
    }

    const next = reservas.filter((r) => String(r.id) !== String(id));
    localStorage.setItem(claveAlmacen, JSON.stringify(next));
    setReservas(next);
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
        className="d-flex justify-content-center"
        style={{ flexGrow: 1, padding: "30px 0" }}
      >
        <PageTransition>
          <div
            style={{
              width: "95%",
              maxWidth: "1100px",
              backgroundColor: "#f9ecd1",
              borderRadius: "24px",
              padding: "35px 30px",
              boxShadow: "0px 8px 22px rgba(0,0,0,0.20)",
            }}
          >
            <h1
              style={{
                fontWeight: "800",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              Mis Reservas
            </h1>

            <p
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "rgb(43,63,63)",
              }}
            >
              Aquí puedes revisar o cancelar tus reservas activas.
            </p>

            {!usuario ? (
              <div className="alert alert-warning text-center">
                Debes iniciar sesión para ver tus reservas.
              </div>
            ) : reservas.length === 0 ? (
              <div className="alert alert-info text-center">
                No tienes reservas registradas.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reservas.map((r) => (
                  <div
                    key={String(r.id)}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "18px",
                      padding: "20px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    {/* ICONO GRANDE */}
                    <div
                      style={{
                        fontSize: "42px",
                        padding: "15px",
                        backgroundColor: "#ffe7c2",
                        borderRadius: "16px",
                      }}
                    >
                      📅
                    </div>

                    {/* INFO */}
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ marginBottom: "4px", fontWeight: 700 }}>
                        {r.fecha} — {r.hora}
                      </h4>

                      <p style={{ margin: 0, padding: 0 }}>
                        👥 Personas: <strong>{r.personas}</strong>
                      </p>

                      {r.status && (
                        <p style={{ margin: "4px 0" }}>
                          Estado:{" "}
                          <span className="badge bg-info">{r.status}</span>
                        </p>
                      )}

                      <small style={{ color: "#6c757d" }}>
                        Creada: {new Date(r.createdAt).toLocaleString()}
                      </small>
                    </div>

                    {/* BOTÓN */}
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => cancelarReserva(r.id)}
                      style={{
                        height: "40px",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
