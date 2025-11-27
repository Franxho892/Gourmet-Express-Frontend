import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/estilo.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import axiosClient from "../api/axiosClient";

import ImgHamburguesa from "../assets/imgmenu/Hamburguesa.jpg";
import ImgPapas from "../assets/imgmenu/Papas.jpg";
import ImgCompleto from "../assets/imgmenu/completo.jpg";
import ImgSandwichPollo from "../assets/imgmenu/Sandwich_pollo.jpeg";
import ImgPizza from "../assets/imgmenu/Pizza.jpg";
import ImgCesar from "../assets/imgmenu/Cesar.jpg";
import ImgPollo from "../assets/imgmenu/Pollo.jpg";
import ImgEmpanadas from "../assets/imgmenu/Empanadas.jpg";
import PageTransition from "../components/PageTransition";

interface PlatoBackend {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imageUri?: string;
}

interface PlatoView {
  id: string;
  titulo: string;
  desc: string;
  precioTexto: string;
  img: string;
}

interface ItemCarrito {
  id: string;
  titulo: string;
  precio: string;
  img: string;
  qty: number;
}

const imagenesMenu = [
  ImgHamburguesa,
  ImgPapas,
  ImgCompleto,
  ImgSandwichPollo,
  ImgPizza,
  ImgCesar,
  ImgPollo,
  ImgEmpanadas,
];

function formatearPrecioCLP(valor: number): string {
  if (Number.isNaN(valor)) return "$0";
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });
}

export default function Menu() {
  const { usuario } = useAuth();
  const navegar = useNavigate();

  const [platos, setPlatos] = useState<PlatoView[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await axiosClient.get<PlatoBackend[]>(
          "http://localhost:8081/platos"
        );

        const data: PlatoBackend[] = respuesta.data ?? [];

        const platosTransformados: PlatoView[] = data.map(
          (p: PlatoBackend, index: number) => {
            const imgPorDefecto =
              imagenesMenu[index % imagenesMenu.length] ?? ImgHamburguesa;

            const img =
              p.imageUri && p.imageUri.startsWith("http")
                ? p.imageUri
                : imgPorDefecto;

            return {
              id: String(p.id ?? index),
              titulo: p.nombre ?? `Plato ${index + 1}`,
              desc:
                p.descripcion ??
                "Un delicioso plato de nuestro menú Gourmet Express.",
              precioTexto: formatearPrecioCLP(p.precio ?? 0),
              img,
            };
          }
        );

        setPlatos(platosTransformados);
      } catch (err) {
        console.error("Error al cargar platos", err);
        setError("No se pudieron cargar los platos. Intenta más tarde.");
      } finally {
        setCargando(false);
      }
    };

    fetchPlatos();
  }, []);

  const agregarAlCarrito = (titulo: string, precio: string, img: string) => {
    if (!usuario) {
      navegar(`/login?from=${encodeURIComponent("/menu")}`);
      return;
    }

    const key = `gourmet_cart:${usuario.email}`;
    const raw = localStorage.getItem(key);
    const lista: ItemCarrito[] = raw ? JSON.parse(raw) : [];

    const id = titulo;
    const existente = lista.find((i) => i.id === id);

    if (existente) {
      existente.qty += 1;
    } else {
      lista.push({ id, titulo, precio, img, qty: 1 });
    }

    localStorage.setItem(key, JSON.stringify(lista));

    window.dispatchEvent(new Event("carrito-actualizado"));

    setToast("Agregado al carrito");
    setTimeout(() => setToast(null), 1500);
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

      {/* Toast de notificación */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            transition: "all 0.3s ease",
          }}
        >
          {toast}
        </div>
      )}

      <main className="container flex-grow-1 py-4">
        <PageTransition>
          {/* Encabezado del menú */}
          <header className="mb-4 text-center text-md-start">
            <h1 className="titulomenu mb-3">Descubre nuestro Menú de Sabores</h1>
            <p className="mb-2" style={{ color: "rgb(43,63,63)" }}>
              Elige entre nuestras opciones de hamburguesas, snacks y platos
              preparados al momento. Puedes agregar tus favoritos al carrito y
              pagar en línea.
            </p>
            {platos.length > 0 && !cargando && !error && (
              <span
                className="badge"
                style={{
                  backgroundColor: "#c59e39",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                }}
              >
                {platos.length} platos disponibles hoy
              </span>
            )}
          </header>

          {/* Estados de carga / error / vacío */}
          {cargando && (
            <div className="alert alert-info">
              Cargando platos del menú, por favor espere...
            </div>
          )}

          {error && !cargando && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!cargando && !error && platos.length === 0 && (
            <div className="alert alert-warning">
              No hay platos disponibles por el momento.
            </div>
          )}

          {/* Grid de platos */}
          {!cargando && !error && platos.length > 0 && (
            <section className="row g-3 g-md-4 pe-2 pe-sm-3 pe-md-4">
              {platos.map((p, index) => (
                <article
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={p.id}
                >
                  <div
                    className="card h-100 border-0"
                    style={{
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Badge opcional en algunos platos para que se vea más “vivo” */}
                    {index % 4 === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          backgroundColor: "#c59e39",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          zIndex: 2,
                        }}
                      >
                        Recomendado
                      </span>
                    )}

                    <img
                      src={p.img}
                      className="card-img-top"
                      alt={p.titulo}
                      style={{ filter: "brightness(0.95)" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5
                        className="card-title"
                        style={{ fontWeight: 700, marginBottom: "0.5rem" }}
                      >
                        {p.titulo}
                      </h5>
                      <p
                        className="card-text flex-grow-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {p.desc}
                      </p>
                      <div
                        className="mt-2 mb-2"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: 700,
                        }}
                      >
                        <span>Precio:</span>
                        <span>{p.precioTexto}</span>
                      </div>

                      <button
                        className="btn btn-sm btn-success mt-auto w-100"
                        onClick={() =>
                          agregarAlCarrito(p.titulo, p.precioTexto, p.img)
                        }
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
