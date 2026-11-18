import { ProductoForm } from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import { useState } from "react";
import type { Producto } from "./services/productoService";
import "./App.css";

function App() {
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const handleEditar =(producto: Producto)=>{
    setProductoEditar(producto);
  }
  return (
    <main className="container">
      <ProductoForm key={productoEditar?.id ?? "nuevo"} productoEditar={productoEditar} />
      <ProductoLista onEditar={setProductoEditar} />
    </main>
  );
}

export default App;