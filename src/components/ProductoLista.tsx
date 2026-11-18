import { useEffect, useState } from "react";
import { obtenerProductos, eliminarProducto, type Producto } from "../services/productoService";
import "./ProductoLista.css";

interface Props {
    productos: Producto[];
    setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
    onEditar: (producto: Producto) => void;
}

export const ProductoLista = ({ productos, setProductos,onEditar }: Props) => {

   

    const handleEliminar = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            return;
        }
        
        try {
            await eliminarProducto(id);
            setProductos(productos.filter((p) => p.id !== id));
            alert("Producto eliminado correctamente")

        } catch (error) {
            console.log("Error: " + error)

        }
    }

    return (
        <div className="lista-container">
            <div>
                <h1>LISTA DE PRODUCTOS</h1>
            </div>

            <div className="lista-header-row">
                <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}></span>
                </div>
                <span className="badge-count">{productos.length} productos</span>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>Productos</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th style={{ textAlign: "right" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>
                                    <div className="producto-nombre-td">{producto.nombre}</div>
                                    <div className="producto-id-sub">ID: {producto.id}</div>
                                </td>
                                <td style={{ fontWeight: 600, color: "#0f172a" }}>
                                    ${producto.precio}
                                </td>
                                <td>
                                    <span className="stock-badge">{producto.stock} un.</span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button
                                        className="btn-accion"
                                        onClick={() => onEditar(producto)}>Editar
                                    </button>
                                    <button
                                        className="btn-accion"
                                        onClick={() => handleEliminar(producto.id)}>Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="lista-footer-note">La lista se actualiza después de guardar tus cambios.</p>
        </div>
    );
};