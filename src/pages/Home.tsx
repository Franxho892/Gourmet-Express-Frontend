import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/estilo.css";
import { useEffect } from "react";
import PageTransition from "../components/PageTransition";


export default function Home() {

  useEffect(() => {
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

        <PageTransition>
                  <div
                    className="card shadow-lg"
                    style={{
                      width: "100%",
                      maxWidth: "900px",
                      borderRadius: "18px",
                      backgroundColor: "#f9ecd1",
                    }}
                  ></div>

        {/* ===== HERO / CARRUSEL ===== */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <div
            id="carouselExample"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3500"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="/img/Hamburguesa.jpg"
                  className="d-block w-100"
                  alt="Hamburguesa Gourmet"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="/img/Papas.jpg"
                  className="d-block w-100"
                  alt="Papas fritas crujientes"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="/img/Pizza.jpg"
                  className="d-block w-100"
                  alt="Pizza al horno de piedra"
                />
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.55)",
                padding: "15px 25px",
                borderRadius: "10px",
                color: "white",
                textAlign: "center",
                maxWidth: "80%",
              }}
            >
              <h2 style={{ fontWeight: 600, fontSize: "1.8rem", marginBottom: "5px" }}>
                Bienvenidos a Gourmet Express
              </h2>
              <p style={{ marginBottom: "10px" }}>
                Comida rápida con sabor gourmet. Calidad, frescura y buen precio.
              </p>
              <a className="btn btn-warning btn-lg fw-bold" href="/menu">
                Ver Menú
              </a>
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN DE BIENVENIDA ===== */}
        <section className="container mt-5 p-4 rounded"
          style={{
            backgroundColor: "#f9ecd1",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            textAlign: "center",
            animation: "fadein 0.6s ease",
          }}
        >
          <h1 className="mb-3" style={{ fontWeight: 700 }}>¿Qué ofrecemos?</h1>

          <p className="lead">
            Platos rápidos, deliciosos y con verdadera calidad Gourmet.
          </p>

          <p style={{ fontSize: "1.1rem" }}>
            Desde hamburguesas jugosas, pizzas artesanales, completos y más…
            Todo preparado con ingredientes frescos.
          </p>
        </section>

        {/* ===== VIDEO DE AMBIENTE ===== */}
        <section className="container mt-5 p-4 rounded"
          style={{
            backgroundColor: "#f8f1de",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            animation: "fadein 0.6s ease",
          }}
        >
          <h2 className="text-center mb-4" style={{ fontWeight: 700 }}>
            Conoce nuestro ambiente
          </h2>

          <div className="d-flex justify-content-center">
            <div className="video-container" style={{ maxWidth: "800px", width: "100%" }}>
              <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden" }}>
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
           </PageTransition>
      </main>
          
      <Footer />
    </div>
  );
}
