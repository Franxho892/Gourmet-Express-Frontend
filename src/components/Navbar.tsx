import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "blanchedalmond" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Gourmet Express</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/menu">Menu</Link>
            <Link className="nav-link" to="/reservar">Reservar</Link>
          </div>
          <div className="navbar-nav">
            {usuario ? (
              <>
                <span className="navbar-text me-3">Hola, {usuario.name}</span>
                <Link className="nav-link" to="/mis-reservas">Mis Reservas</Link>
                <Link className="nav-link" to="/carrito">Carrito</Link>
                <button className="btn btn-outline-secondary ms-2" onClick={cerrarSesion}>Salir</button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Ingresar</Link>
                <Link className="nav-link" to="/register">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
