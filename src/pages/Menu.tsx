import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/estilo.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImgHamburguesa from "../assets/imgmenu/Hamburguesa.jpg";
import ImgPapas from "../assets/imgmenu/Papas.jpg";
import ImgCompleto from "../assets/imgmenu/completo.jpg";
import ImgSandwichPollo from "../assets/imgmenu/Sandwich_pollo.jpeg";
import ImgPizza from "../assets/imgmenu/Pizza.jpg";
import ImgCesar from "../assets/imgmenu/Cesar.jpg";
import ImgPollo from "../assets/imgmenu/Pollo.jpg";
import ImgEmpanadas from "../assets/imgmenu/Empanadas.jpg";

interface Plato {
  titulo: string;
  img: string;
  desc: string;
  precio: string;
}

const platos: Plato[] = [
  { titulo: "Hamburguesa Clásica", img: ImgHamburguesa, desc: "Con carne de vacuno, queso cheddar, lechuga, tomate y mayonesa.", precio: "$4.500" },
  { titulo: "Papas Fritas", img: ImgPapas, desc: "Perfectas para acompañamiento o para compartir.", precio: "$1.500"},
  { titulo: "Completo Italiano", img: ImgCompleto, desc: "Tomate, palta y mayonesa, el clásico.", precio: "$2.500"},
  { titulo: "Sándwich de Pollo", img: ImgSandwichPollo, desc: "Con lechuga, tomate y mayonesa.", precio: "$3.500"},
  { titulo: "Pizza Margarita", img: ImgPizza, desc: "Salsa de tomate, mozzarella y albahaca fresca.", precio: "$7.500"},
  { titulo: "Ensalada César", img: ImgCesar, desc: "Lechuga, crutones, parmesano y aderezo César.", precio: "$5.500"},
  { titulo: "Alitas BBQ", img: ImgPollo, desc: "Jugosas alitas bañadas en salsa barbacoa.", precio: "$6.500"},
  { titulo: "Empanada de Pollo", img: ImgEmpanadas, desc: "Pollo desmenuzado, condimentos y queso.", precio: "$2.500"},
];

export default function Menu() {
  const { usuario } = useAuth();
  const navegar = useNavigate();

  const agregarAlCarrito = (titulo: string, precio: string, img: string) => {
    if (!usuario) {
      navegar(`/login?from=${encodeURIComponent('/menu')}`);
      return;
    }
    const key = `gourmet_cart:${usuario.email}`;
    const raw = localStorage.getItem(key);
    const lista: Array<{ id: string; titulo: string; precio: string; img: string; qty: number }> = raw ? JSON.parse(raw) : [];
    const id = titulo;
    const existente = lista.find((i) => i.id === id);
    if (existente) {
      existente.qty += 1;
    } else {
      lista.push({ id, titulo, precio, img, qty: 1 });
    }
    localStorage.setItem(key, JSON.stringify(lista));
    alert("Agregado al carrito");
  };
  return (
    <div style={{ backgroundColor: "rgb(43,63,63)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container flex-grow-1">
        <h1 className="titulomenu">Descubre nuestro Menú de Sabores</h1>
        <section className="row g-3 g-md-4 pe-2 pe-sm-3 pe-md-4">
          {platos.map((p, i) => (
            <article className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
              <div className="card h-100">
                <img src={p.img} className="card-img-top" alt={p.titulo} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.titulo}</h5>
                  <p className="card-text flex-grow-1">{p.desc}</p>
                  <div className="mt-2 fw-bold">Precio: {p.precio}</div>
                  <button className="btn btn-sm btn-success mt-3 align-self-start" onClick={() => agregarAlCarrito(p.titulo, p.precio, p.img)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
