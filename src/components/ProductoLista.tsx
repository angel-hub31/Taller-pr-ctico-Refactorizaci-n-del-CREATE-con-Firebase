import { useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../services/productoService";
import "./ProductoLista.css";

interface Props {
    onEditar: (producto: Producto) => void;
}

export const ProductoLista = ({ onEditar }: Props) => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const datos = await obtenerProductos();
                setProductos(datos);
            } catch (error) {
                console.error("Error al obtener productos: ", error);
            }
        };
        cargarProductos();
    }, []);

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
                                        onClick={() => onEditar(producto)}
                                    >
                                        Editar
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