
import { useState } from "react";
import { ProductoForm } from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import { obtenerProductosDisponibles, type Producto } from "./services/productoService";
import "./App.css";

function App() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  // Selecciona el producto que se desea editar
  const handleEditar = (producto: Producto) => {
    setProductoEditar(producto);
  };

  // Se ejecuta cuando termina de crear o actualizar
  const handleGuardadoExitoso = () => {
    setProductoEditar(null);
  };

  return (
    <div className="app-layout">

      <header className="app-header">
        <div className="header-content">

        </div>
      </header>

      <main className="container">

        <section className="page-heading">
          <div>
            <h1>Gestión de inventario</h1>
          </div>
        </section>

        <div className="content-grid">

          <ProductoForm
            key={productoEditar?.id ?? "nuevo"}
            productoEditar={productoEditar}
            onGuardado={handleGuardadoExitoso}
          />

          <ProductoLista
            productos={productos}
            setProductos={setProductos}
            onEditar={handleEditar}
          />

          <button onClick={async()=>{
            const productoDeConsulta = await obtenerProductosDisponibles();
            console.log(productoDeConsulta)
          }}>Consulta</button>

        </div>

      </main>
    </div>
  );
}

export default App;
