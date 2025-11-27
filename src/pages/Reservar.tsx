import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/estilo.css";
import axiosClient from "../api/axiosClient";
import PageTransition from "../components/PageTransition";

interface DatosFormulario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  personas: string;
  fecha: string;
  hora: string;
}

interface ErroresFormulario {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  personas?: string;
  fecha?: string;
  hora?: string;
}

export default function Reservar() {
  const { usuario } = useAuth();
  const location = useLocation();

  // Solo usuarios logueados pueden reservar
  if (!usuario) {
    const redirectTo = `/login?from=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  const [formulario, setFormulario] = useState<DatosFormulario>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    personas: "",
    fecha: "",
    hora: "",
  });
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [mensaje, setMensaje] = useState("");

  // Fecha mínima para el input date (hoy)
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const validarCampo = (name: string, value: string): string => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es requerido";
        if (value.trim().length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        return "";
      case "apellido":
        if (!value.trim()) return "El apellido es requerido";
        if (value.trim().length < 2)
          return "El apellido debe tener al menos 2 caracteres";
        return "";
      case "email":
        if (!value.trim()) return "El email es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Ingrese un email válido";
        return "";
      case "telefono":
        if (!value.trim()) return "El teléfono es requerido";
        if (!/^[0-9+\-\s()]+$/.test(value))
          return "El teléfono solo puede contener números y símbolos válidos";
        if (value.replace(/[^0-9]/g, "").length < 8)
          return "El teléfono debe tener al menos 8 dígitos";
        return "";
      case "personas":
        if (!value) return "Seleccione el número de personas";
        return "";
      case "fecha":
        if (!value) return "Seleccione una fecha";
        {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selected = new Date(value);
          if (selected < today) return "La fecha no puede ser en el pasado";
        }
        return "";
      case "hora":
        if (!value) return "Seleccione una hora";
        return "";
      default:
        return "";
    }
  };

  const manejarCambio = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    const error = validarCampo(name, value);
    setErrores({ ...errores, [name]: error });
  };

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: ErroresFormulario = {};
    Object.keys(formulario).forEach((key) => {
      const error = validarCampo(
        key,
        formulario[key as keyof DatosFormulario]
      );
      if (error) newErrors[key as keyof ErroresFormulario] = error;
    });

    setErrores(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMensaje("❌ Por favor corrija los errores antes de continuar.");
      return;
    }

    try {
      setMensaje("");

      const payload = {
        fecha: formulario.fecha,
        hora: formulario.hora,
        personas: Number(formulario.personas),
        nombre: `${formulario.nombre} ${formulario.apellido}`.trim(),
        telefono: formulario.telefono,
        status: "PENDIENTE",
      };

      const respuesta = await axiosClient.post(
        "http://localhost:8080/reservas",
        payload
      );
      const reservaCreada = respuesta.data;

      if (usuario) {
        const key = `gourmet_reservations:${usuario.email}`;
        const listRaw = localStorage.getItem(key);
        const list = listRaw ? JSON.parse(listRaw) : [];
        list.push({
          id: reservaCreada.id ?? Date.now(),
          fecha: reservaCreada.fecha,
          hora: reservaCreada.hora,
          personas: reservaCreada.personas,
          status: reservaCreada.status,
          createdAt: Date.now(),
        });
        localStorage.setItem(key, JSON.stringify(list));
        setMensaje("✔️ La reserva fue creada y guardada en tu cuenta.");
      } else {
        setMensaje("✔️ La reserva fue creada en el sistema.");
      }

      setFormulario({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        personas: "",
        fecha: "",
        hora: "",
      });
      setErrores({});
    } catch (error) {
      console.error("Error al crear la reserva", error);
      setMensaje(
        "❌ Ocurrió un error al crear la reserva. Inténtalo nuevamente más tarde."
      );
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
        className="w-100 d-flex flex-grow-1 justify-content-center align-items-center"
        style={{ padding: "20px" }}
      >
        <PageTransition>
          <div
            className="card shadow-lg"
            style={{
              width: "100%",
              maxWidth: "1000px",
              borderRadius: "18px",
              backgroundColor: "#f9ecd1",
            }}
          >
            <div
              className="card-body p-4 p-md-5"
              style={{
                display: "flex",
                gap: "30px",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {/* Columna izquierda: info y contexto */}
              <div style={{ flex: "1 1 320px", minWidth: "280px" }}>
                <h2 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>
                  Reserva tu mesa en Gourmet Express
                </h2>
                <p className="mb-2">
                  Completa el formulario para asegurar tu mesa en el horario que
                  más te acomode.
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>Elige fecha y hora disponible.</li>
                  <li>Indica cuántas personas asistirán.</li>
                  <li>Ingresa tus datos de contacto.</li>
                </ul>
                <p className="mt-3 mb-0">
                  Recibirás la confirmación directamente en tu cuenta y podrás
                  revisar tus reservas en la sección{" "}
                  <strong>“Mis Reservas”</strong>.
                </p>
              </div>

              {/* Columna derecha: formulario */}
              <div
                style={{
                  flex: "1 1 380px",
                  minWidth: "300px",
                  background: "white",
                  padding: "20px",
                  borderRadius: "14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h3 className="text-center mb-3" style={{ fontWeight: 700 }}>
                  Datos de la reserva
                </h3>

                <form className="row g-3" onSubmit={manejarEnvio}>
                  <div className="col-md-6">
                    <label className="form-label">Fecha</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errores.fecha ? "is-invalid" : ""
                      }`}
                      name="fecha"
                      value={formulario.fecha}
                      onChange={manejarCambio}
                      min={todayStr}
                      required
                    />
                    {errores.fecha && (
                      <div className="invalid-feedback">{errores.fecha}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Hora</label>
                    <select
                      className={`form-select ${
                        errores.hora ? "is-invalid" : ""
                      }`}
                      name="hora"
                      value={formulario.hora}
                      onChange={manejarCambio}
                    >
                      <option value="">Seleccione...</option>
                      {Array.from({ length: 11 }, (_, i) => 12 + i).map(
                        (h) => {
                          const label = `${String(h).padStart(2, "0")}:00`;
                          return (
                            <option key={h} value={label}>
                              {label}
                            </option>
                          );
                        }
                      )}
                    </select>
                    {errores.hora && (
                      <div className="invalid-feedback">{errores.hora}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errores.nombre ? "is-invalid" : ""
                      }`}
                      name="nombre"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                    />
                    {errores.nombre && (
                      <div className="invalid-feedback">{errores.nombre}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errores.apellido ? "is-invalid" : ""
                      }`}
                      name="apellido"
                      value={formulario.apellido}
                      onChange={manejarCambio}
                    />
                    {errores.apellido && (
                      <div className="invalid-feedback">
                        {errores.apellido}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errores.email ? "is-invalid" : ""
                      }`}
                      name="email"
                      value={formulario.email}
                      onChange={manejarCambio}
                    />
                    {errores.email && (
                      <div className="invalid-feedback">{errores.email}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errores.telefono ? "is-invalid" : ""
                      }`}
                      name="telefono"
                      value={formulario.telefono}
                      onChange={manejarCambio}
                    />
                    {errores.telefono && (
                      <div className="invalid-feedback">
                        {errores.telefono}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Personas</label>
                    <select
                      className={`form-select ${
                        errores.personas ? "is-invalid" : ""
                      }`}
                      name="personas"
                      value={formulario.personas}
                      onChange={manejarCambio}
                    >
                      <option value="">Seleccione...</option>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    {errores.personas && (
                      <div className="invalid-feedback">
                        {errores.personas}
                      </div>
                    )}
                  </div>

                  <div className="col-12 text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                    >
                      Reservar
                    </button>
                  </div>

                  {mensaje && (
                    <div className="col-12">
                      <div className="alert alert-success mt-3 text-center">
                        {mensaje}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
