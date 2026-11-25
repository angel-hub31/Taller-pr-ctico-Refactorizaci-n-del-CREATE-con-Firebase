import {  useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { obtenerProductosPaginados, type Producto } from "../services/productoService";


export const ProductoListaPaginada = () => {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [UltimoDocumento, setUltimoDocumento] = useState<QueryDocumentSnapshot<DocumentData>>()

    const cargarPrimeraPagina = async () => {
        const resultado = await obtenerProductosPaginados();
        setProductos(resultado.productos);
        setUltimoDocumento(resultado.ultimoDocumento)
    }

    const siguientePagina = async () => {
        if (!UltimoDocumento) return;

        const resultado = await obtenerProductosPaginados(UltimoDocumento);

        setProductos(resultado.productos);
        setUltimoDocumento(resultado.ultimoDocumento);

    }
    return (
        <div>
            <h2>
                Productos Paginados
                <button onClick={cargarPrimeraPagina}> Cargar productos</button>
                {productos.map((producto) => (
                    <div>
                        <div>
                        <p key={producto.id}>
                            {producto.nombre}
                            ${producto.precio}
                            {producto.stock}

                        </p>
                    </div>

                    <div>
                        <button onClick={siguientePagina} disabled={!UltimoDocumento}>Siguiente</button>
                    </div>
                    </div>

                ))}
            </h2>
        </div>
    )
}
