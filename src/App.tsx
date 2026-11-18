import { ProductoForm } from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import { useState, useEffect } from "react";
import { obtenerProductos, type Producto } from "./services/productoService";
import "./App.css";

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const cargarProductos = async () => {
    try {
      const datos = await obtenerProductos();
      setProductos(datos);
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEditar = (producto: Producto) => {
    setProductoEditar(producto);
  };

  // Función para recargar al guardar y limpiar la edición
  const handleGuardadoExitoso = () => {
    cargarProductos();
    setProductoEditar(null);
  };

  return (
    <main className="container">
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
    </main>
  );
}

export default App;