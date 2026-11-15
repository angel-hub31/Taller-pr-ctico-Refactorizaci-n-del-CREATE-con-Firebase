import { useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../services/productoService";
import "./ProductoLista.css"

export const ProductoLista = () => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const datos = await obtenerProductos();
                setProductos(datos)

            } catch (error) {
                console.error("Error al obtener productos: ", error);

            }
        }
        cargarProductos();

    }, [])
    return (
        <div className="lista-container">
            <h2>Lista de Productos</h2>
            {productos.map((producto) => (
                <div key={producto.id} className="producto-item">
                    <h3>ID: {producto.id}</h3>
                    <p className="producto-nombre">Nombre: {producto.nombre}</p>
                    <p>Precio: ${producto.precio}</p>
                    <p>Stock: {producto.stock}</p>
                </div>
            ))}
        </div>
    );
};