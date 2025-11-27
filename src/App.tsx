
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Reservar from "./pages/Reservar";
import "../src/assets/estilo.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MisReservas from "./pages/MisReservas";
import { AuthProvider } from "./context/AuthContext";
import Carrito from "./pages/Carrito";
import Admin from "./pages/Admin";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />   
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
