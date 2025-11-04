import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/estilo.css";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    // Reproduce el video automáticamente (mismo script del HTML original)
    const v = document.querySelector("video");
    if (v) {
      v.muted = true;
      const tryPlay = () => v.play().catch(() => {});
      tryPlay();
      ["click", "touchstart", "keydown"].forEach(evt =>
        window.addEventListener(evt, tryPlay, { once: true })
      );
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgb(43, 63, 63)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main style={{ flex: "1 0 auto" }}>
        {/* ===== Carrusel ===== */}
        <section aria-labelledby="carrusel-title">
          <h2 id="carrusel-title" className="visually-hidden">
            Promociones destacadas
          </h2>

          <div
            id="carouselExample"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="/img/Hamburguesa.jpg"
                  className="d-block w-100"
                  alt="Hamburguesa Gourmet"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="/img/Papas.jpg"
                  className="d-block w-100"
                  alt="Papas fritas crujientes"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="/img/Pizza.jpg"
                  className="d-block w-100"
                  alt="Pizza al horno de piedra"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </section>

        {/* ===== Bienvenida ===== */}
        <section className="container mt-4 p-4 rounded" aria-labelledby="bienvenida-title">
          <h1 id="bienvenida-title" className="text-center mb-4">Bienvenidos a Gourmet Express</h1>
          <div className="bienvenida p-3 p-md-5 rounded text-center">
            <p className="lead mb-3">¡Tu restaurante de comida rápida favorito!</p>
            <hr className="my-4" />
            <p className="mb-4">
              Disfruta de nuestras deliciosas hamburguesas, papas fritas y
              bebidas refrescantes en un ambiente acogedor y familiar. ¡Te
              esperamos!
            </p>
            <a className="btn btn-primary btn-lg" href="/menu" role="button">
              Ver Menú
            </a>
          </div>
        </section>

        {/* ===== Video ===== */}
        <section className="container mt-4 p-4 rounded" aria-labelledby="video-title">
          <h2 id="video-title" className="text-center mb-4">Conoce nuestro ambiente</h2>
          <div className="d-flex justify-content-center">
            <div className="video-container" style={{ maxWidth: '800px', width: '100%' }}>
              <div className="ratio ratio-16x9">
                <video
                  className="w-100 h-100"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/img/Hamburguesa.jpeg"
                >
                  <source src="/video/ambiente.mp4" type="video/mp4" />
                  Tu navegador no admite video HTML5.
                </video>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
