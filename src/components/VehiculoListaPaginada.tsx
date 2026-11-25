import { useEffect, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
    obtenerPaginaAnteriorVehiculos,
    obtenerPrimeraPaginaVehiculos,
    obtenerSiguientePaginaVehiculos,
    type Vehiculo,
} from "../../scripts/paginacionVehiculos";
import "./TarjetasVehiculos.css";

function VehiculoListaPaginada() {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [pagina, setPagina] = useState<number>(1);
    const [primerDoc, setPrimerDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [ultimoDoc, setUltimoDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hayMas, setHayMas] = useState<boolean>(false);
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const cargarPrimeraPagina = async () => {
        setCargando(true);
        setError(null);
        try {
            const resultado = await obtenerPrimeraPaginaVehiculos();
            setVehiculos(resultado.vehiculos);
            setPrimerDoc(resultado.primerDoc);
            setUltimoDoc(resultado.ultimoDoc);
            setHayMas(resultado.hayMas);
            setPagina(1);
        } catch (err) {
            console.error("Error al cargar Página 1:", err);
            setError("Ocurrió un error al cargar la primera página.");
        } finally {
            setCargando(false);
        }
    };

    const manejarSiguiente = async () => {
        if (!ultimoDoc || !hayMas || cargando) return;
        setCargando(true);
        setError(null);
        try {
            const resultado = await obtenerSiguientePaginaVehiculos(ultimoDoc);
            if (resultado.vehiculos.length > 0) {
                setVehiculos(resultado.vehiculos);
                setPrimerDoc(resultado.primerDoc);
                setUltimoDoc(resultado.ultimoDoc);
                setHayMas(resultado.hayMas);
                setPagina((prev) => prev + 1);
            } else {
                setHayMas(false);
            }
        } catch (err) {
            console.error("Error al avanzar de página:", err);
            setError("Ocurrió un error al cargar la siguiente página.");
        } finally {
            setCargando(false);
        }
    };

    const manejarAnterior = async () => {
        if (pagina <= 1 || !primerDoc || cargando) return;
        setCargando(true);
        setError(null);
        try {
            if (pagina === 2) {
                await cargarPrimeraPagina();
                return;
            }
            const resultado = await obtenerPaginaAnteriorVehiculos(primerDoc);
            if (resultado.vehiculos.length > 0) {
                setVehiculos(resultado.vehiculos);
                setPrimerDoc(resultado.primerDoc);
                setUltimoDoc(resultado.ultimoDoc);
                setHayMas(true);
                setPagina((prev) => Math.max(1, prev - 1));
            }
        } catch (err) {
            console.error("Error al retroceder de página:", err);
            setError("Ocurrió un error al cargar la página anterior.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPrimeraPagina();
    }, []);

    return (
        <div className="tabla-wrap">
            <header className="tabla-header">
                <div>
                    <h1>Inventario de Vehículos</h1>
                    <p className="tabla-header__sub">
                        Paginación directa en Cloud Firestore · Máx. 10 registros por vista
                    </p>
                </div>
                <span className="tabla-badge">Página {pagina}</span>
            </header>

            {error && <p className="tabla-estado">{error}</p>}
            {cargando && <p className="tabla-estado">Cargando registros...</p>}

            {!cargando && vehiculos.length === 0 && !error && (
                <p className="tabla-estado">No hay vehículos disponibles.</p>
            )}

            {!cargando && vehiculos.length > 0 && (
                <div className="tabla-card">
                    <table className="tabla-datos">
                        <thead>
                            <tr>
                                {/* [CAMBIO 1 - CABECERAS]: Antes tenías "Vehículo" y "Tipo". Cámbialas a "Marca" y "Modelo" */}
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Tipo</th>
                                <th>Año</th>
                                <th className="col-derecha">Precio</th>
                                <th className="col-derecha">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map((vehiculo) => (
                                <tr key={vehiculo.id}>
                                    <td className="vehiculo-nombre">{vehiculo.marca}</td>

                                    <td>{vehiculo.modelo}</td>

                                    <td>
                                        <span className="pill-tipo">{vehiculo.tipo}</span>
                                    </td>

                                    <td>{vehiculo.anio}</td>
                                    <td className="col-derecha col-precio">
                                        ${vehiculo.precio.toLocaleString("en-US")}
                                    </td>
                                    <td className="col-derecha">
                                        <span
                                            className={
                                                vehiculo.stock === 0
                                                    ? "pill-stock pill-stock--agotado"
                                                    : "pill-stock"
                                            }
                                        >
                                            {vehiculo.stock === 0 ? "Agotado" : `${vehiculo.stock} uds.`}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <nav className="tabla-controles" aria-label="Controles de paginación">
                <div className="tabla-controles__grupo">
                    <button
                        type="button"
                        className="btn-pag"
                        onClick={manejarAnterior}
                        disabled={pagina <= 1 || cargando}
                    >
                        Anterior
                    </button>

                    <button
                        type="button"
                        className="btn-pag btn-pag--primario"
                        onClick={manejarSiguiente}
                        disabled={!hayMas || cargando}
                    >
                        Siguiente
                    </button>
                </div>

                <span className="tabla-controles__info">
                    Mostrando {vehiculos.length} de máx. 10 registros
                </span>
            </nav>
        </div>
    );
}

export default VehiculoListaPaginada;