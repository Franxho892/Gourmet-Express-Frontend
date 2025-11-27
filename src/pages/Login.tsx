import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const err = await iniciarSesion(correo, contrasena);
    setError(err);

    if (!err) {
      setSuccess("Inicio de sesión exitoso. Redirigiendo al menú...");
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
        {/* === ANIMACIÓN === */}
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
              className="card-body p-4 p-md-5"
              style={{
                display: "flex",
                gap: "30px",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {/* Columna izquierda */}
              <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
                <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                  Bienvenido a Gourmet Express
                </h2>

                <p className="mb-2">
                  Inicia sesión para continuar con tu experiencia:
                </p>

                <ul style={{ paddingLeft: "20px" }}>
                  <li>Ver tus reservas realizadas.</li>
                  <li>Acceder al menú y al carrito.</li>
                  <li>Repetir pedidos de forma más rápida.</li>
                  <li>Gestionar tus datos de usuario.</li>
                </ul>

                <p className="mt-3 mb-0">
                  Si aún no tienes cuenta, puedes registrarte para comenzar a
                  usar todas las funciones del sistema.
                </p>
              </div>

              {/* Columna derecha */}
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
                  Iniciar Sesión
                </h1>

                <form onSubmit={handleSubmit}>
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

                  {error && (
                    <div className="alert alert-danger mt-2">{error}</div>
                  )}

                  {success && (
                    <div className="alert alert-success mt-2">{success}</div>
                  )}

                  <div className="text-center mt-3">
                    <button type="submit" className="btn btn-success px-4">
                      Entrar
                    </button>

                    <p className="mt-3 mb-0">
                      ¿No tienes cuenta?{" "}
                      <Link to="/register">Regístrate aquí</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </PageTransition>
        {/* === FIN ANIMACIÓN === */}
      </main>

      <Footer />
    </div>
  );
}
