
import { useState } from "react";

import {
    obtenerCursosEstudiante,
    obtenerEstudiantesCurso,
    obtenerMatriculasActivas,
    obtenerMatriculaPorId,
    type Matricula
} from "../services/matriculaService";

function ConsultaMatriculas() {

    const [tipoConsulta, setTipoConsulta] = useState("estudiante");

    const [identificador, setIdentificador] = useState("");

    const [matriculas, setMatriculas] = useState<Matricula[]>([]);

    const [mensaje, setMensaje] = useState("");

    const [cargando, setCargando] = useState(false);

    const ejecutarConsulta = async () => {

        setCargando(true);
        setMensaje("");
        setMatriculas([]);

        try {

            let resultado: Matricula[] = [];

            switch (tipoConsulta) {

                // 1. Cursos de un estudiante
                case "estudiante":

                    if (!identificador.trim()) {
                        setMensaje("Ingrese el ID del estudiante");
                        return;
                    }

                    resultado = await obtenerCursosEstudiante(
                        identificador.trim()
                    );

                    break;


                // 2. Estudiantes de un curso
                case "curso":

                    if (!identificador.trim()) {
                        setMensaje("Ingrese el ID del curso");
                        return;
                    }

                    resultado = await obtenerEstudiantesCurso(
                        identificador.trim()
                    );

                    break;


                // 3. Matrículas activas
                case "activas":

                    resultado = await obtenerMatriculasActivas();

                    break;


                // 4. Matrícula por ID
                case "id":

                    if (!identificador.trim()) {
                        setMensaje("Ingrese el ID de la matrícula");
                        return;
                    }

                    const matricula = await obtenerMatriculaPorId(
                        identificador.trim()
                    );

                    resultado = matricula ? [matricula] : [];

                    break;
            }

            setMatriculas(resultado);

            if (resultado.length === 0) {
                setMensaje("No se encontraron matrículas");
            }

        } catch (error) {

            console.error("Error al consultar matrículas:", error);

            setMensaje("Ocurrió un error al realizar la consulta");

        } finally {

            setCargando(false);

        }
    };

    return (

        <div>

            <h2>Consulta de Matrículas</h2>

            <div>

                <label>Tipo de consulta: </label>

                <select
                    value={tipoConsulta}
                    onChange={(e) => {
                        setTipoConsulta(e.target.value);
                        setIdentificador("");
                        setMatriculas([]);
                        setMensaje("");
                    }}
                >

                    <option value="estudiante">
                        Cursos de un estudiante
                    </option>

                    <option value="curso">
                        Estudiantes de un curso
                    </option>

                    <option value="activas">
                        Matrículas activas
                    </option>

                    <option value="id">
                        Matrícula por ID
                    </option>

                </select>

            </div>

            {tipoConsulta !== "activas" && (

                <div>

                    <label>
                        {tipoConsulta === "estudiante"
                            ? "ID del estudiante:"
                            : tipoConsulta === "curso"
                            ? "ID del curso:"
                            : "ID de la matrícula:"
                        }
                    </label>

                    <input
                        type="text"
                        value={identificador}
                        onChange={(e) => setIdentificador(e.target.value)}
                        placeholder="Ingrese el identificador"
                    />

                </div>

            )}

            <div>

                <button
                    onClick={ejecutarConsulta}
                    disabled={cargando}
                >
                    {cargando ? "Consultando..." : "Consultar"}
                </button>

            </div>

            {mensaje && (

                <p>{mensaje}</p>

            )}

            {matriculas.length > 0 && (

                <div>

                    <h3>
                        Resultados encontrados: {matriculas.length}
                    </h3>

                    <table border={1} cellPadding={8}>

                        <thead>

                            <tr>
                                <th>ID Matrícula</th>
                                <th>ID Estudiante</th>
                                <th>Estudiante</th>
                                <th>ID Curso</th>
                                <th>Curso</th>
                                <th>Estado</th>
                                <th>Periodo</th>
                            </tr>

                        </thead>

                        <tbody>

                            {matriculas.map((matricula) => (

                                <tr key={matricula.id}>

                                    <td>{matricula.id}</td>

                                    <td>{matricula.estudianteId}</td>

                                    <td>{matricula.estudianteNombre}</td>

                                    <td>{matricula.cursoId}</td>

                                    <td>{matricula.cursoNombre}</td>

                                    <td>{matricula.estado}</td>

                                    <td>{matricula.periodo}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}

export default ConsultaMatriculas;
