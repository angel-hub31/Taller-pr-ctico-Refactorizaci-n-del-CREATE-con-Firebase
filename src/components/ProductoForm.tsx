import { useState, type FormEvent } from "react";
import { crearProducto, actualizarProducto, type Producto } from "../services/productoService";
import "./productoForm.css";

interface Props {
    productoEditar: Producto | null;
    onGuardado: ()=>void;
}

export function ProductoForm({ productoEditar, onGuardado}: Props) {
    const [nombre, setNombre] = useState(productoEditar?.nombre ?? "");
    const [precio, setPrecio] = useState(productoEditar?.precio.toString() ?? "");
    const [stock, setStock] = useState(productoEditar?.stock.toString() ?? "");
    const [cargando, setCargando] = useState(false);

    const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cargando) return;

        setCargando(true);
        try {
            if (productoEditar) {
                await actualizarProducto(
                    productoEditar.id,
                    nombre.trim(),
                    Number(precio),
                    Number(stock)
                );
                console.log("Producto actualizado");

                alert("Producto actualizado corrrectamente");
            } else {
                const id = await crearProducto({
                    nombre: nombre.trim(),
                    precio: Number(precio),
                    stock: Number(stock),
                });
                console.log("Producto creado con ID:", id);
                alert("Producto creado exitosamente");


                // Limpiamos los inputs
                setNombre("");
                setPrecio("");
                setStock("");
            }

            onGuardado();
        } catch (error) {
            console.error("Error al registrar:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card">
            <h1 className="title">
                {productoEditar ? "Editar producto" : "Registro de productos"}
            </h1>

            <form className="form-group" onSubmit={guardarProducto}>
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
                    {cargando ? "Guardando..." : productoEditar ? "Actualizar" : "Guardar"}
                </button>
            </form>
        </div>
    );
}