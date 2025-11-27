import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

export default function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const err = await registrar(nombre, correo, contrasena);
    setError(err);

    if (!err) {
      setSuccess("Registro exitoso. Redirigiendo al menú...");
      setTimeout(() => {
        navigate("/menu", { replace: true });
      }, 1000);
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
                      maxWidth: "900px",
                      borderRadius: "18px",
                      backgroundColor: "#f9ecd1",
                    }}
                  >


        <div
          className="card shadow-lg"
          style={{
            width: "100%",
            maxWidth: "1100px", 
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

  
  <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
    <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
      Únete a Gourmet Express
    </h2>

    <p className="mb-2">
      Crea tu cuenta para disfrutar una mejor experiencia:
    </p>

    <ul style={{ paddingLeft: "20px" }}>
      <li>Realizar reservas fácilmente.</li>
      <li>Acceder al menú actualizado.</li>
      <li>Guardar tu historial de pedidos.</li>
      <li>Gestionar tu información de forma segura.</li>
    </ul>

    <p className="mt-3 mb-0">
      Tu cuenta mejora tu experiencia en línea y en el local.
    </p>
  </div>

  <div
    style={{
      flex: "1 1 350px",
      minWidth: "300px",
      background: "white",
      padding: "20px",
      borderRadius: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h1 className="text-center mb-3" style={{ fontWeight: 700 }}>
      Crear Cuenta
    </h1>

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="text-center mt-3">
        <button type="submit" className="btn btn-success px-4">
          Registrarse
        </button>

        <p className="mt-3 mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </form>
  </div>
  </div>
</div>
        </div>
         </PageTransition>
      </main>

      <Footer />
    </div>
  );
}

