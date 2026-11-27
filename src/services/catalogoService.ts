import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    endBefore,
    limitToLast,
} from "firebase/firestore";
import type {
    QueryConstraint,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
// Instancia de Cloud Firestore configurada en la app
import { db } from "../firebase";

// Estructura del objeto anidado "ficha" que trae cada documento del catálogo
export interface FichaTecnica {
    idiomaOriginal: string;
    clasificacion: string;
    duracionOTemporadas: string;
}

// Modelo tipado de un documento dentro de la colección "catalogo"
export interface ContenidoCatalogo {
    id?: string; // Opcional porque al consultar Firestore el ID viene en snap.id
    titulo: string;
    tipo: "pelicula" | "serie" | string;
    genero: string;
    anioEstreno: number;
    calificacion: number;
    disponible: boolean;
    ficha: FichaTecnica;
}

// Estructura devuelta por la paginación por cursores para controlar la tabla y los botones
export interface ResultadoPaginado {
    items: ContenidoCatalogo[]; // Registros de la página actual
    primerDoc: QueryDocumentSnapshot<DocumentData> | null; // Cursor para retroceder (endBefore)
    ultimoDoc: QueryDocumentSnapshot<DocumentData> | null; // Cursor para avanzar (startAfter)
    hayMas: boolean; // Indica si existe al menos un documento más en la siguiente página
}

// Tipos válidos de patrones de acceso soportados por el servicio
export type ModoConsulta =
    | "por_tipo"
    | "por_genero"
    | "disponibles"
    | "por_calificacion"
    | "por_id";

const COLLECTION_NAME = "catalogo"; // Nombre de la colección en Firestore
const PAGE_SIZE = 5; // Cantidad máxima de registros por página

// Transforma un QueryDocumentSnapshot de Firestore en un objeto ContenidoCatalogo con su id
const mapDocToContenido = (
    snap: QueryDocumentSnapshot<DocumentData>
): ContenidoCatalogo => ({
    id: snap.id,
    ...(snap.data() as Omit<ContenidoCatalogo, "id">),
});

// Arma los filtros (where) y ordenamientos (orderBy) según el patrón elegido
const construirBaseConstraints = (
    modo: Exclude<ModoConsulta, "por_id">,
    valorFiltro: string
): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [];

    // Patrón 1: Igualdad por "tipo" ("pelicula" o "serie") ordenado alfabéticamente por título
    if (modo === "por_tipo") {
        constraints.push(where("tipo", "==", valorFiltro));
        constraints.push(orderBy("titulo", "asc"));
    }

    // Patrón 2: Igualdad por "genero" ordenado alfabéticamente por título
    if (modo === "por_genero") {
        constraints.push(where("genero", "==", valorFiltro));
        constraints.push(orderBy("titulo", "asc"));
    }

    // Patrón 3: Solo documentos donde "disponible" sea true, ordenados por título
    if (modo === "disponibles") {
        constraints.push(where("disponible", "==", true));
        constraints.push(orderBy("titulo", "asc"));
    }

    if (modo === "por_calificacion") {
        constraints.push(where("calificacion", ">=", 7));
        constraints.push(where("calificacion", "<=", 8));

        constraints.push(orderBy("titulo", "asc"));
    }

    return constraints;
};

// Ejecuta una consulta paginada usando cursores de Firestore en lugar de offset
export const consultarCatalogoPaginado = async (
    modo: Exclude<ModoConsulta, "por_id">,
    valorFiltro = "",
    opciones?: {
        cursorSiguiente?: QueryDocumentSnapshot<DocumentData> | null;
        cursorAnterior?: QueryDocumentSnapshot<DocumentData> | null;
    }
): Promise<ResultadoPaginado> => {
    const colRef = collection(db, COLLECTION_NAME);
    const baseConstraints = construirBaseConstraints(modo, valorFiltro);

    // Rama de retroceso: trae los PAGE_SIZE documentos anteriores a "cursorAnterior"
    if (opciones?.cursorAnterior) {
        const qPrev = query(
            colRef,
            ...baseConstraints,
            endBefore(opciones.cursorAnterior),
            limitToLast(PAGE_SIZE)
        );
        const snapPrev = await getDocs(qPrev);
        const itemsPrev = snapPrev.docs.map(mapDocToContenido);

        return {
            items: itemsPrev,
            primerDoc: snapPrev.docs.length > 0 ? snapPrev.docs[0] : null,
            ultimoDoc:
                snapPrev.docs.length > 0 ? snapPrev.docs[snapPrev.docs.length - 1] : null,
            // Al retroceder desde una página posterior, se asume que hay página siguiente
            hayMas: snapPrev.docs.length > 0,
        };
    }

    // Rama de primera página o avance: usa startAfter si hay cursor y pide PAGE_SIZE + 1
    // Pedir 1 documento extra permite saber si hay más páginas sin hacer otra consulta
    const forwardConstraints: QueryConstraint[] = [...baseConstraints];
    if (opciones?.cursorSiguiente) {
        forwardConstraints.push(startAfter(opciones.cursorSiguiente));
    }
    forwardConstraints.push(limit(PAGE_SIZE + 1));

    const qNext = query(colRef, ...forwardConstraints);
    const snapNext = await getDocs(qNext);

    const hayMas = snapNext.docs.length > PAGE_SIZE;
    // Se recorta a PAGE_SIZE para mostrar solo la cantidad exacta de la página
    const docsPagina = hayMas ? snapNext.docs.slice(0, PAGE_SIZE) : snapNext.docs;

    return {
        items: docsPagina.map(mapDocToContenido),
        primerDoc: docsPagina.length > 0 ? docsPagina[0] : null,
        ultimoDoc: docsPagina.length > 0 ? docsPagina[docsPagina.length - 1] : null,
        hayMas,
    };
};

// Patrón 4: Lectura directa de un único documento por su ID (más económica que una query)
export const obtenerContenidoPorId = async (
    idDocumento: string
): Promise<ContenidoCatalogo | null> => {
    const docRef = doc(db, COLLECTION_NAME, idDocumento.trim());
    const docSnap = await getDoc(docRef);

    // Si no existe el documento en Firestore, se retorna null
    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<ContenidoCatalogo, "id">),
    };
};