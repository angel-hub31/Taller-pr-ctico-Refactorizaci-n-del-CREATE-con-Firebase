import { useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../services/productoService";


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
        <div>
            <h2>Lista de Productos</h2>
            {
                productos.map((producto) => (
                    <div key={producto.id}>
                        <h3> ID: {producto.id}</h3>
                        <p>Nombre: {producto.nombre}</p>
                        <p>Precio: ${producto.precio}</p>
                        <p>Stock: {producto.stock}</p>
                    </div>
                ))
            }
        </div>
    );
};