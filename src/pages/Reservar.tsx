import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/estilo.css";

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

  const validarCampo = (name: string, value: string): string => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es requerido";
        if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El nombre solo puede contener letras";
        return "";
      case "apellido":
        if (!value.trim()) return "El apellido es requerido";
        if (value.trim().length < 2) return "El apellido debe tener al menos 2 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El apellido solo puede contener letras";
        return "";
      case "email":
        if (!value.trim()) return "El email es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingrese un email válido";
        return "";
      case "telefono":
        if (!value.trim()) return "El teléfono es requerido";
        if (!/^[0-9+\-\s()]+$/.test(value)) return "El teléfono solo puede contener números y símbolos válidos";
        if (value.replace(/[^0-9]/g, "").length < 8) return "El teléfono debe tener al menos 8 dígitos";
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

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    
    // Validar campo en tiempo real
    const error = validarCampo(name, value);
    setErrores({ ...errores, [name]: error });
  };

  const manejarEnvio = (e: FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors: ErroresFormulario = {};
    Object.keys(formulario).forEach((key) => {
      const error = validarCampo(key, formulario[key as keyof DatosFormulario]);
      if (error) newErrors[key as keyof ErroresFormulario] = error;
    });
    
    setErrores(newErrors);
    
    // Verificar si hay errores
    if (Object.keys(newErrors).length > 0) {
      setMensaje("❌ Por favor corrija los errores antes de continuar.");
      return;
    }
    
    // Guardar reserva si está logueado
    if (usuario) {
      const reserva = {
        id: `${Date.now()}`,
        fecha: formulario.fecha,
        hora: formulario.hora,
        personas: formulario.personas,
        createdAt: Date.now(),
      };
      const key = `gourmet_reservations:${usuario.email}`;
      const listRaw = localStorage.getItem(key);
      const list = listRaw ? JSON.parse(listRaw) : [];
      list.push(reserva);
      localStorage.setItem(key, JSON.stringify(list));
      setMensaje("✔️ La reserva fue creada y guardada en tu cuenta.");
    } else {
      setMensaje("✔️ La reserva fue creada. Inicia sesión para guardarla en tu cuenta.");
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(43,63,63)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container mt-4 p-3 p-md-4 rounded flex-grow-1">
        <h1 className="text-center mb-4">Ingrese Datos de Contacto para Reservar</h1>
        <form className="row g-3" onSubmit={manejarEnvio}>
          {(() => {
            // Calcular hoy en formato YYYY-MM-DD para atributo min del input date
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;
            return (
              <>
                <div className="col-md-4">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
                    name="fecha"
                    value={formulario.fecha}
                    onChange={manejarCambio}
                    min={todayStr}
                    required
                  />
                  {errores.fecha && <div className="invalid-feedback">{errores.fecha}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Hora</label>
                  <select
                    className={`form-select ${errores.hora ? 'is-invalid' : ''}`}
                    name="hora"
                    value={formulario.hora}
                    onChange={manejarCambio}
                  >
                    <option value="">Seleccione...</option>
                    {Array.from({ length: 11 }, (_, i) => 12 + i).map((h) => {
                      const label = `${String(h).padStart(2, '0')}:00`;
                      return (
                        <option key={h} value={label}>{label}</option>
                      );
                    })}
                  </select>
                  {errores.hora && <div className="invalid-feedback">{errores.hora}</div>}
                </div>
              </>
            );
          })()}
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input 
              type="text" 
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} 
              name="nombre" 
              value={formulario.nombre} 
              onChange={manejarCambio} 
            />
            {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellido</label>
            <input 
              type="text" 
              className={`form-control ${errores.apellido ? 'is-invalid' : ''}`} 
              name="apellido" 
              value={formulario.apellido} 
              onChange={manejarCambio} 
            />
            {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className={`form-control ${errores.email ? 'is-invalid' : ''}`} 
              name="email" 
              value={formulario.email} 
              onChange={manejarCambio} 
            />
            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Teléfono</label>
            <input 
              type="tel" 
              className={`form-control ${errores.telefono ? 'is-invalid' : ''}`} 
              name="telefono" 
              value={formulario.telefono} 
              onChange={manejarCambio} 
            />
            {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Personas</label>
            <select 
              className={`form-select ${errores.personas ? 'is-invalid' : ''}`} 
              name="personas" 
              value={formulario.personas} 
              onChange={manejarCambio}
            >
              <option value="">Seleccione...</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {errores.personas && <div className="invalid-feedback">{errores.personas}</div>}
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary btn-lg px-5">Reservar</button>
          </div>
          {mensaje && <div className="alert alert-success mt-3 text-center">{mensaje}</div>}
        </form>
      </main>
      <Footer />
    </div>
  );
}
