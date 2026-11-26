
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "firebase/firestore";

import { db } from "../firebase";

// Interfaz de una matrícula
export interface Matricula {
    id: string;
    estudianteId: string;
    estudianteNombre: string;
    cursoId: string;
    cursoNombre: string;
    estado: string;
    periodo: string;
}

// Referencia a la colección
const matriculasRef = collection(db, "matriculas");


// 1. Consultar cursos de un estudiante
export const obtenerCursosEstudiante = async (
    estudianteId: string
): Promise<Matricula[]> => {

    const q = query(
        matriculasRef,
        where("estudianteId", "==", estudianteId)
    );

    const resultado = await getDocs(q);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    } as Matricula));
};


// 2. Consultar estudiantes de un curso
export const obtenerEstudiantesCurso = async (
    cursoId: string
): Promise<Matricula[]> => {

    const q = query(
        matriculasRef,
        where("cursoId", "==", cursoId)
    );

    const resultado = await getDocs(q);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    } as Matricula));
};


// 3. Consultar matrículas activas
export const obtenerMatriculasActivas = async (): Promise<Matricula[]> => {

    const q = query(
        matriculasRef,

        // CAMBIO REALIZADO:
        // Antes: where("estado", "==", "activa")
        // Ahora: buscamos "Activo", que es el valor de Firestore.

        where("estado", "==", "Activo")
    );

    const resultado = await getDocs(q);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    } as Matricula));
};


// 4. Consultar matrícula por ID
export const obtenerMatriculaPorId = async (
    matriculaId: string
): Promise<Matricula | null> => {

    const referencia = doc(db, "matriculas", matriculaId);

    const resultado = await getDoc(referencia);

    if (resultado.exists()) {

        return {
            id: resultado.id,
            ...resultado.data()
        } as Matricula;

    }

    return null;
};
