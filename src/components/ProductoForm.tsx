
import { useState, type FormEvent } from "react";

import {
    crearProducto,
    actualizarProducto,
    type Producto
} from "../services/productoService";

import "./ProductoForm.css";

interface Props {
    productoEditar: Producto | null;
    onGuardado: () => void;
}

// Componente para registrar y editar productos
export function ProductoForm({ productoEditar, onGuardado }: Props) {

    const [nombre, setNombre] = useState(productoEditar?.nombre ?? "");
    const [precio, setPrecio] = useState(productoEditar?.precio.toString() ?? "");
    const [stock, setStock] = useState(productoEditar?.stock.toString() ?? "");
    const [categoria, setCategoria] = useState(productoEditar?.categoria ?? "");
    const [cargando, setCargando] = useState(false);

    // Función para guardar o actualizar productos
    const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (cargando) return;

        setCargando(true);

        try {

            if (productoEditar) {

                // Actualizar producto existente
                await actualizarProducto(
                    productoEditar.id,
                    nombre.trim(),
                    Number(precio),
                    Number(stock),
                    categoria.trim()
                );

                alert("Producto actualizado correctamente");

            } else {

                // Crear un nuevo producto
                const id = await crearProducto({
                    nombre: nombre.trim(),
                    precio: Number(precio),
                    stock: Number(stock),
                    categoria: categoria.trim()
                });

                console.log("Producto creado con ID:", id);

                alert("Producto creado exitosamente");

                // Limpiar formulario
                setNombre("");
                setPrecio("");
                setStock("");
                setCategoria("");
            }

            // Notificar al componente padre
            onGuardado();

        } catch (error) {

            console.error("Error al guardar producto:", error);
            alert("Ocurrió un error al guardar el producto");

        } finally {

            setCargando(false);

        }
    };

    return (

        <div className="producto-form-card">

            {/* CABECERA DEL PANEL */}

            <div className="form-card-header">


                <div className="form-header-text">

                    <h2>
                        {productoEditar
                            ? "Editar producto"
                            : "Registro de productos"}
                    </h2>

                </div>

            </div>

            {/* CUERPO DEL FORMULARIO */}

            <form className="form-group" onSubmit={guardarProducto}>

                {/* NOMBRE */}

                <div className="input-field">

                    <label htmlFor="nombre">
                        Nombre del producto
                    </label>

                    <input
                        id="nombre"
                        type="text"
                        placeholder="Ej. Parlante Alexa"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                </div>

                {/* PRECIO Y STOCK */}

                <div className="form-row">

                    <div className="input-field">

                        <label htmlFor="precio">
                            Precio ($)
                        </label>

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

                        <label htmlFor="stock">
                            Stock disponible
                        </label>

                        <input
                            id="stock"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />

                    </div>

                </div>

                <div className="input-field">

                    <label htmlFor="categoria">
                        Categoría
                    </label>

                    <input
                        id="categoria"
                        type="text"
                        placeholder="Ej. Tecnología"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    />

                </div>

                <button
                    className="btn-submit"
                    type="submit"
                    disabled={cargando}
                >

                    {cargando
                        ? "Guardando..."
                        : productoEditar
                            ? "Guardar cambios"
                            : "Registrar producto"}

                </button>

            </form>

        </div>
    );
}
