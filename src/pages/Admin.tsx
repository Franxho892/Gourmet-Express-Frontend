import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import PageTransition from "../components/PageTransition";

interface ReservaBackend {
  id: number;
  fecha: string;
  hora: string;
  personas: number;
  nombre?: string;
  telefono?: string;
  status?: string;
}

export default function Admin() {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState<ReservaBackend[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!usuario) {
    return <Navigate to="/login?from=/admin" replace />;
  }

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        setCargando(true);
        setError(null);
        const resp = await axiosClient.get<ReservaBackend[]>(
          "http://localhost:8080/reservas"
        );
        setReservas(resp.data ?? []);
      } catch (err) {
        console.error("Error al cargar reservas", err);
        setError("No se pudieron cargar las reservas desde el backend.");
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, []);

  const getEstadoBadgeClass = (status?: string) => {
    const s = (status ?? "PENDIENTE").toUpperCase();
    if (s.startsWith("CONFIRM")) return "bg-success";
    if (s.startsWith("CANCEL")) return "bg-danger";
    return "bg-warning text-dark";
  };

  const total = reservas.length;
  const pendientes = reservas.filter(
    (r) => (r.status ?? "PENDIENTE").toUpperCase().startsWith("PEND")
  ).length;
  const confirmadas = reservas.filter(
    (r) => (r.status ?? "").toUpperCase().startsWith("CONFIRM")
  ).length;

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
              padding: "30px 26px",
              boxShadow: "0px 8px 22px rgba(0,0,0,0.20)",
            }}
          >
            <h1
              className="text-center"
              style={{ fontWeight: 800, marginBottom: "10px" }}
            >
              Panel de Administración
            </h1>

            <p className="text-center mb-4">
              Bienvenido, <strong>{usuario.name}</strong>. Aquí puedes revisar
              todas las reservas registradas en el sistema.
            </p>

            {/* Resumen rápido */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  minWidth: "170px",
                  textAlign: "center",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#555" }}>
                  Reservas totales
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                  {total}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  minWidth: "170px",
                  textAlign: "center",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#555" }}>
                  Pendientes
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                  {pendientes}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  minWidth: "170px",
                  textAlign: "center",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#555" }}>
                  Confirmadas
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                  {confirmadas}
                </div>
              </div>
            </div>

            {cargando && <p>Cargando reservas...</p>}

            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && reservas.length === 0 && (
              <div className="alert alert-info text-center">
                No hay reservas registradas.
              </div>
            )}

            {!cargando && !error && reservas.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead
                    style={{
                      backgroundColor: "#f5d9a9",
                      borderRadius: "10px",
                    }}
                  >
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Personas</th>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.fecha}</td>
                        <td>{r.hora}</td>
                        <td>{r.personas}</td>
                        <td>{r.nombre ?? "-"}</td>
                        <td>{r.telefono ?? "-"}</td>
                        <td>
                          <span
                            className={
                              "badge " + getEstadoBadgeClass(r.status)
                            }
                          >
                            {r.status ?? "PENDIENTE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
