import { useState, type FormEvent } from "react";
import { crearProducto } from "../services/productoService";
import "../App.css"

export function ProductoForm() {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cargando) return;

        setCargando(true);
        try {
            const id = await crearProducto({
                nombre: nombre.trim(),
                precio: Number(precio),
                stock: Number(stock),
            });

            console.log("Producto creado con ID:", id);

            // Limpiamos los inputs
            setNombre("");
            setPrecio("");
            setStock("");
        } catch (error) {
            console.error("Error al registrar:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card">
            <h1 className="title">Registro de productos</h1>

            <form className="form-group" onSubmit={handleSubmit}>
                <div className="input-field">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Ej. Parlante Alexa"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="precio">Precio ($)</label>
                    <input
                        id="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="stock">Stock disponible</label>
                    <input
                        id="stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>

                <button className="btn-submit" type="submit" disabled={cargando}>
                    {cargando ? "Guardando..." : "Guardar producto"}
                </button>
            </form>
        </div>
    );
}