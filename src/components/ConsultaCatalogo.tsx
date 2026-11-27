import { useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import type { ContenidoCatalogo, ModoConsulta } from "../services/catalogoService";
import {
    consultarCatalogoPaginado,
    obtenerContenidoPorId,
} from "../services/catalogoService";
import "./ConsultaCatalogo.css";

export function ConsultaCatalogo() {

    const [modoSeleccionado, setModoSeleccionado] = useState<ModoConsulta>("por_tipo");
    // Estados de controles de filtro
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("pelicula");
    const [generoSeleccionado, setGeneroSeleccionado] = useState<string>("Ciencia Ficción");
    const [ calificacionMinima,setCalificacionMinima]= useState<string>("7")


    const [idBusqueda, setIdBusqueda] = useState<string>("TIT001");

    // Estado de consulta activa y paginación basada en cursores
    const [modoActual, setModoActual] = useState<ModoConsulta>("por_tipo");
    const [valorFiltroActual, setValorFiltroActual] = useState<string>("pelicula");
    const [resultados, setResultados] = useState<ContenidoCatalogo[]>([]);
    const [primerDoc, setPrimerDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [ultimoDoc, setUltimoDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const [haySiguiente, setHaySiguiente] = useState<boolean>(false);

    // Estados de carga y feedback
    const [cargando, setCargando] = useState<boolean>(false);
    const [mensaje, setMensaje] = useState<string>("");


    const obtenerValorSegunModo = (modo: ModoConsulta): string => {
        if (modo === "por_tipo") return tipoSeleccionado;
        if (modo === "por_genero") return generoSeleccionado;
        if (modo === "por_calificacion") return calificacionMinima;
        if (modo === "por_id") return idBusqueda.trim();
        return "";
    };

    const ejecutarConsulta = async (modo: ModoConsulta, valor = "") => {
        setCargando(true);
        setMensaje("");
        setResultados([]);
        setPrimerDoc(null);
        setUltimoDoc(null);
        setPaginaActual(1);
        setHaySiguiente(false);
        setModoActual(modo);
        setValorFiltroActual(valor);

        try {
            if (modo === "por_id") {
                if (!valor) {
                    setMensaje("Ingresa un ID de documento para buscar.");
                    return;
                }
                const docEncontrado = await obtenerContenidoPorId(valor);
                if (!docEncontrado) {
                    setMensaje(`No se encontró ningún documento con ID "${valor}".`);
                } else {
                    setResultados([docEncontrado]);
                }
                return;
            }

            const pagina = await consultarCatalogoPaginado(modo, valor);
            setResultados(pagina.items);
            setPrimerDoc(pagina.primerDoc);
            setUltimoDoc(pagina.ultimoDoc);
            setHaySiguiente(pagina.hayMas);

            if (pagina.items.length === 0) {
                setMensaje("No se encontraron registros para este criterio.");
            }
        } catch (error) {
            console.error("Error al consultar Firestore:", error);
            setMensaje(
                "Error en la consulta. Si Firestore solicita un índice compuesto, revisa el enlace en la consola del navegador."
            );
        } finally {
            setCargando(false);
        }
    };

    const manejarBuscarUnificado = () => {
        const valor = obtenerValorSegunModo(modoSeleccionado);
        void ejecutarConsulta(modoSeleccionado, valor);
    };

    const manejarSiguiente = async () => {
        if (modoActual === "por_id" || !haySiguiente || !ultimoDoc) {
            return;
        }

        setCargando(true);
        setMensaje("");

        try {
            const pagina = await consultarCatalogoPaginado(
                modoActual,
                valorFiltroActual,
                { cursorSiguiente: ultimoDoc }
            );

            if (pagina.items.length > 0) {
                setResultados(pagina.items);
                setPrimerDoc(pagina.primerDoc);
                setUltimoDoc(pagina.ultimoDoc);
                setHaySiguiente(pagina.hayMas);
                setPaginaActual((prev) => prev + 1);
            } else {
                setHaySiguiente(false);
            }
        } catch (error) {
            console.error("Error al ir a la siguiente página:", error);
            setMensaje("No se pudo cargar la siguiente página.");
        } finally {
            setCargando(false);
        }
    };

    const manejarAnterior = async () => {
        if (modoActual === "por_id" || paginaActual <= 1 || !primerDoc) {
            return;
        }

        setCargando(true);
        setMensaje("");

        try {
            const pagina = await consultarCatalogoPaginado(
                modoActual,
                valorFiltroActual,
                { cursorAnterior: primerDoc }
            );

            if (pagina.items.length > 0) {
                setResultados(pagina.items);
                setPrimerDoc(pagina.primerDoc);
                setUltimoDoc(pagina.ultimoDoc);
                setHaySiguiente(pagina.hayMas);
                setPaginaActual((prev) => Math.max(1, prev - 1));
            }
        } catch (error) {
            console.error("Error al ir a la página anterior:", error);
            setMensaje("No se pudo cargar la página anterior.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="catalogo-wrapper">
            <header className="catalogo-header">
                <h1 className="catalogo-titulo">Catálogo de Películas y Series</h1>

            </header>

            {/* CAMBIO EN PANEL: se reemplazan las 4 tarjetas con botones individuales por la barra unificada */}
            <section className="panel-controles">
                <h2 className="panel-titulo">Controles de Consulta</h2>

                <div className="barra-unificada">
                    {/* NUEVO: selector del patrón de acceso */}
                    <div className="campo-unificado">
                        <label className="filtro-label" htmlFor="select-patron">
                            Patrón de consulta
                        </label>
                        <select
                            id="select-patron"
                            className="filtro-control"
                            value={modoSeleccionado}
                            onChange={(e) =>
                                setModoSeleccionado(e.target.value as ModoConsulta)
                            }
                        >
                            <option value="por_tipo">1. Tipo de contenido</option>
                            <option value="por_genero">2. Género</option>
                            <option value="disponibles">3. Disponibles</option>
                            <option value="por_id">4. ID de documento</option>
                            <option value = "por_calificacion">5. Por Calificacion </option>

                        </select>







                    </div>

                    {/* NUEVO: muestra solo el control correspondiente al patrón elegido (sin su botón propio) */}
                    <div className="campo-unificado">
                        {modoSeleccionado === "por_tipo" && (
                            <>
                                <label className="filtro-label" htmlFor="select-tipo">
                                    Tipo
                                </label>
                                <select
                                    id="select-tipo"
                                    className="filtro-control"
                                    value={tipoSeleccionado}
                                    onChange={(e) => setTipoSeleccionado(e.target.value)}
                                >
                                    <option value="pelicula">Película</option>
                                    <option value="serie">Serie</option>
                                </select>
                            </>
                        )}

                        {modoSeleccionado === "por_genero" && (
                            <>
                                <label className="filtro-label" htmlFor="select-genero">
                                    Género
                                </label>
                                <select
                                    id="select-genero"
                                    className="filtro-control"
                                    value={generoSeleccionado}
                                    onChange={(e) => setGeneroSeleccionado(e.target.value)}
                                >
                                    <option value="Ciencia Ficción">Ciencia Ficción</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Acción">Acción</option>
                                    <option value="Terror">Terror</option>
                                    <option value="Animación">Animación</option>
                                    <option value="Comedia">Comedia</option>
                                </select>
                            </>
                        )}



                        {modoSeleccionado === "disponibles" && (
                            <>
                                <span className="filtro-label">Estado</span>
                                <div className="texto-fijo-filtro">
                                    Solo títulos disponibles (disponible == true)
                                </div>
                            </>
                        )}

                        {modoSeleccionado === "por_id" && (
                            <>
                                <label className="filtro-label" htmlFor="input-id">
                                    ID del documento
                                </label>
                                <input
                                    id="input-id"
                                    type="text"
                                    className="filtro-control"
                                    value={calificacionMinima}
                                    onChange={(e) => setCalificacionMinima(e.target.value)}
                                    placeholder="Ej: TIT001"
                                />
                            </>
                        )}



                            {modoSeleccionado === "por_calificacion" && (
                            <>
                                <label className="filtro-label" htmlFor="select-calificcacion">
                                    Calificacion
                                </label>
                                <input
                                    id="select-calificacion"
                                    type="text"
                                    className="filtro-control"
                                    value={calificacionMinima}
                                    onChange={(e) => setCalificacionMinima(e.target.value)}
                                />
                            </>
                        )}





                    </div>


                    {/* NUEVO: botón único que ejecuta cualquiera de los 4 patrones */}
                    <div className="campo-boton">
                        <button
                            type="button"
                            className="btn btn-primario btn-buscar-unico"
                            onClick={manejarBuscarUnificado}
                            disabled={
                                cargando || (modoSeleccionado === "por_id" && !idBusqueda.trim())
                            }
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </section>

            {/* Tabla y paginación: sin cambios */}
            <main>
                {cargando && <p className="estado-mensaje">Consultando Firestore...</p>}
                {mensaje && <p className="estado-mensaje">{mensaje}</p>}

                {resultados.length > 0 && (
                    <div className="tabla-contenedor">
                        <table className="tabla-catalogo">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Tipo</th>
                                    <th>Género</th>
                                    <th>Año</th>
                                    <th>Calificación</th>
                                    <th>Disponible</th>
                                    <th>Ficha (Idioma / Clasif. / Duración)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((item) => (
                                    <tr key={item.id}>
                                        <td className="celda-id">{item.id}</td>
                                        <td className="celda-titulo">{item.titulo}</td>
                                        <td>{item.tipo}</td>
                                        <td>{item.genero}</td>
                                        <td>{item.anioEstreno}</td>
                                        <td>{item.calificacion}</td>

                                        <td>
                                            <span
                                                className={`badge-estado ${item.disponible ? "badge-si" : "badge-no"
                                                    }`}
                                            >
                                                {item.disponible ? "Sí" : "No"}
                                            </span>
                                        </td>
                                        <td>
                                            {item.ficha
                                                ? `${item.ficha.idiomaOriginal} · ${item.ficha.clasificacion} · ${item.ficha.duracionOTemporadas}`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <nav className="paginacion-barra">
                <span className="paginacion-indicador">Página {paginaActual}</span>
                <div className="paginacion-botones">
                    <button
                        className="btn btn-secundario"
                        onClick={manejarAnterior}
                        disabled={cargando || modoActual === "por_id" || paginaActual <= 1}
                    >
                        Anterior
                    </button>
                    <button
                        className="btn btn-primario"
                        onClick={manejarSiguiente}
                        disabled={cargando || modoActual === "por_id" || !haySiguiente}
                    >
                        Siguiente
                    </button>
                </div>
            </nav>
        </div>
    );
}