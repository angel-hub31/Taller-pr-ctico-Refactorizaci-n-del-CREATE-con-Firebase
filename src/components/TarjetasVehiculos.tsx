import { useState } from "react";
import { FaCar, FaCarSide, FaCarAlt, FaTruckPickup } from "react-icons/fa";
import { consulta1, consulta2, consulta3, consulta4, obtenerVehiculos, type Vehiculo } from "../../scripts/consultaVehiculos";
import "./TarjetasVehiculos.css"

function TarjetasVehiculos() {

    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [detalleConsulta, setDetalleConsulta] = useState(0);

    const ejecutarConsulta = async (consulta: () => Promise<Vehiculo[]>, numero: number) => {
        try {
            const resultado = await consulta();
            setVehiculos(resultado);
            setDetalleConsulta(numero);
            console.log("Consulta ", numero, " : ", resultado)
        } catch (error) {
            console.error(`ERROR en consulta ${numero}:`, error);
        }
    };

    const mostrarDetalleConsulta = () => {
        if (detalleConsulta === 0) {
            return (
                <div className="detalle-consulta">
                    <p>Todos</p>
                </div>
            );
        }

        if (detalleConsulta === 1) {
            return (
                <div className="detalle-consulta">
                    <h3>Consulta 1</h3>
                    <p><strong>Filtros:</strong> stock &gt; 0</p>
                    <p><strong>Orden:</strong> precio ASC</p>
                    <p><strong>Descripción:</strong> Vehículos disponibles ordenados de menor a mayor precio.</p>
                </div>
            );
        }

        if (detalleConsulta === 2) {
            return (
                <div className="detalle-consulta">
                    <h3>Consulta 2</h3>
                    <p><strong>Filtros:</strong> tipo == "SUV", stock &gt; 0</p>
                    <p><strong>Orden:</strong> precio ASC</p>
                </div>
            );
        }

        if (detalleConsulta === 3) {
            return (
                <div className="detalle-consulta">
                    <h3>Consulta 3</h3>
                    <p><strong>Filtros:</strong> precio &gt;= 20000, precio &lt;= 40000, stock &gt; 0</p>
                    <p><strong>Orden:</strong> precio ASC</p>
                </div>
            );
        }

        if (detalleConsulta === 4) {
            return (
                <div className="detalle-consulta">
                    <h3>Consulta 4 — Reto</h3>
                    <p><strong>Filtros:</strong> tipo == "Sedan", anio &gt;= 2023, stock &gt; 0</p>
                    <p><strong>Orden:</strong> anio DESC</p>
                </div>
            );
        }

        return null;   // por si llega un número que no existe
    };

    // SOLO PRESENTACIÓN: elige color e ícono según el tipo. No toca datos ni consultas.
    const estiloPorTipo = (tipo: string) => {
        if (tipo === "Sedan") return { clase: "vh-tipo--sedan", icono: <FaCarSide /> };
        if (tipo === "SUV") return { clase: "vh-tipo--suv", icono: <FaCar /> };
        if (tipo === "Pickup") return { clase: "vh-tipo--pickup", icono: <FaTruckPickup /> };
        if (tipo === "Hatchback") return { clase: "vh-tipo--hatchback", icono: <FaCarAlt /> };
        return { clase: "", icono: <FaCar /> };
    };

    // Marca el botón de la consulta que está activa
    const claseFiltro = (numero: number) =>
        detalleConsulta === numero ? "vh-filtro vh-filtro--activo" : "vh-filtro";

    return (

        <div className="vh-app">

            {/* ===== CABECERA ===== */}
            <header className="vh-cabecera">
                <h1>Inventario de vehículos</h1>
            </header>

            <nav className="vh-filtros" aria-label="Consultas">
                <button type="button" className={claseFiltro(0)} onClick={() => ejecutarConsulta(obtenerVehiculos, 0)}>Ver todos</button>
                <button type="button" className={claseFiltro(1)} onClick={() => ejecutarConsulta(consulta1, 1)}>Consulta 1</button>
                <button type="button" className={claseFiltro(2)} onClick={() => ejecutarConsulta(consulta2, 2)}>Consulta 2</button>
                <button type="button" className={claseFiltro(3)} onClick={() => ejecutarConsulta(consulta3, 3)}>Consulta 3</button>
                <button type="button" className={claseFiltro(4)} onClick={() => ejecutarConsulta(consulta4, 4)}>Consulta 4</button>

            </nav>

            {/* ===== REGLA DE LA CONSULTA ACTIVA ===== */}
            <section className="vh-regla">
                <h2 className="vh-regla__titulo">Regla de la consulta</h2>
                {mostrarDetalleConsulta()}
            </section>

            <p className="vh-total">Total de vehículos: <strong>{vehiculos.length}</strong></p>

            {vehiculos.length === 0 && (
                <p className="vh-vacio">Aún no hay resultados. Pulsa un botón para empezar.</p>
            )}

            <div className="vh-grid">
                {vehiculos.map((vehiculo) => {
                    const { clase, icono } = estiloPorTipo(vehiculo.tipo);
                    return (
                        <article key={vehiculo.id} className={`vh-card ${clase}`}>

                            {/* Zona del auto: ícono sobre la carretera */}
                            <div className="vh-card__visual">
                                <span className="vh-card__tipo">{vehiculo.tipo}</span>
                                <span className="vh-card__icono">{icono}</span>
                            </div>

                            {/* Datos del vehículo */}
                            <div className="vh-card__cuerpo">
                                <p className="vh-card__marca">{vehiculo.marca}</p>
                                <h3 className="vh-card__modelo">{vehiculo.modelo}</h3>

                                <div className="vh-card__meta">
                                    <span>{vehiculo.anio}</span>
                                    <span className={vehiculo.stock === 0 ? "vh-stock vh-stock--agotado" : "vh-stock"}>
                                        {vehiculo.stock === 0 ? "Agotado" : `${vehiculo.stock} en stock`}
                                    </span>
                                </div>

                                <div className="vh-card__pie">
                                    <span className="vh-card__precio">${vehiculo.precio.toLocaleString("en-US")}</span>
                                    <span className="vh-card__id" title={vehiculo.id}>{vehiculo.id.slice(0, 6)}</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );

}

export default TarjetasVehiculos;