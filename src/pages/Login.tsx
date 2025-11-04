import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = await iniciarSesion(correo, contrasena);
    setError(err);
    if (!err) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(43,63,63)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container mt-4 p-3 p-md-4 rounded flex-grow-1">
        <h1 className="text-center mb-4">Iniciar Sesión</h1>
        <form className="row g-3 mx-auto" style={{ maxWidth: 480 }} onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="col-12">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          </div>
          {error && <div className="col-12"><div className="alert alert-danger">{error}</div></div>}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary px-4">Entrar</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}


