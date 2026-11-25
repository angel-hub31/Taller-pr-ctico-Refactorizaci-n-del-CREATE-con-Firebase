
import { useEffect } from "react";

import {escucharProductos,eliminarProducto,type Producto} from "../services/productoService";

import "./ProductoLista.css";

interface Props {
    productos: Producto[];
    setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
    onEditar: (producto: Producto) => void;
}

// Componente que muestra la tabla de productos
export const ProductoLista = ({
    productos,
    setProductos,
    onEditar
}: Props) => {

    // Escucha los cambios de Firestore en tiempo real
    useEffect(() => {

        const unsubscribe = escucharProductos((productosActualizados) => {

            // Actualiza el estado de React con los productos recibidos
            setProductos(productosActualizados);

        });

        // Cancela la escucha cuando el componente se desmonta
        return () => {
            unsubscribe();
        };

    }, [setProductos]);

    // Función para eliminar un producto
    const handleEliminar = async (id: string) => {

        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            return;
        }

        try {

            await eliminarProducto(id);

            alert("Producto eliminado correctamente");

        } catch (error) {

            console.log("Error al eliminar producto: " + error);
            alert("No se pudo eliminar el producto");

        }
    };

   return (
        <div className="lista-container">

            <div>
                <h1>LISTA DE PRODUCTOS</h1>
            </div>

            <div className="lista-header-row">


                {/* Muestra la cantidad total de productos */}
                <span className="badge-count">
                    {productos.length} productos
                </span>

            </div>

            <div style={{ overflowX: "auto" }}>

                <table className="tabla-productos">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Productos</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoria</th>
                            <th style={{ textAlign: "right" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {productos.map((producto) => (

                            <tr key={producto.id}>

                                <td>
                                    <span className="producto-id-sub">
                                        {producto.id}
                                    </span>
                                </td>

                                <td>
                                    <div className="producto-nombre-td">
                                        {producto.nombre}
                                    </div>
                                </td>

                                <td style={{
                                    fontWeight: 600,
                                    color: "#0f172a"
                                }}>
                                    ${producto.precio}
                                </td>

                                <td>
                                    <span className="stock-badge">
                                        {producto.stock} un.
                                    </span>
                                </td>

                                <td>
                                    <div className="producto-categoria-td">
                                        {producto.categoria}
                                    </div>
                                </td>

                                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>

                                    {/* Botón para editar */}
                                    <button
                                        className="btn-accion"
                                        onClick={() => onEditar(producto)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn-accion"
                                        onClick={() => handleEliminar(producto.id)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        </div>
    );
};