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
// Importa db desde src/firebase.ts
import { db } from "../firebase";

export interface FichaTecnica {
    idiomaOriginal: string;
    clasificacion: string;
    duracionOTemporadas: string;
}

export interface ContenidoCatalogo {
    id?: string;
    titulo: string;
    tipo: "pelicula" | "serie" | string;
    genero: string;
    anioEstreno: number;
    calificacion: number;
    disponible: boolean;
    ficha: FichaTecnica;
}

export interface ResultadoPaginado {
    items: ContenidoCatalogo[];
    primerDoc: QueryDocumentSnapshot<DocumentData> | null;
    ultimoDoc: QueryDocumentSnapshot<DocumentData> | null;
    hayMas: boolean;
}

export type ModoConsulta =
    | "por_tipo"
    | "por_genero"
    | "disponibles"
    | "por_id";

const COLLECTION_NAME = "catalogo";
const PAGE_SIZE = 10;

// Mapea un documento de Firestore al modelo tipado del catálogo
const mapDocToContenido = (
    snap: QueryDocumentSnapshot<DocumentData>
): ContenidoCatalogo => ({
    id: snap.id,
    ...(snap.data() as Omit<ContenidoCatalogo, "id">),
});

// Construye los filtros y ordenamientos según el patrón de acceso
const construirBaseConstraints = (
    modo: Exclude<ModoConsulta, "por_id">,
    valorFiltro: string
): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [];

    // Patrón 1: Filtrar por tipo ("pelicula" o "serie")
    if (modo === "por_tipo") {
        constraints.push(where("tipo", "==", valorFiltro));
        constraints.push(orderBy("titulo", "asc"));
    }

    // Patrón 2: Filtrar por género
    if (modo === "por_genero") {
        constraints.push(where("genero", "==", valorFiltro));
        constraints.push(orderBy("titulo", "asc"));
    }

    // Patrón 3: Consultar únicamente títulos disponibles
    if (modo === "disponibles") {
        constraints.push(where("disponible", "==", true));
        constraints.push(orderBy("titulo", "asc"));
    }

    return constraints;
};

// Consulta paginada con cursores reales de Firestore (10 registros por página)
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

    // Retroceso real con cursor endBefore + limitToLast
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
            // Si retrocedimos desde una página válida, siempre hay página siguiente
            hayMas: snapPrev.docs.length > 0,
        };
    }

    // Primera página o avance real con startAfter + limit(PAGE_SIZE + 1)
    const forwardConstraints: QueryConstraint[] = [...baseConstraints];
    if (opciones?.cursorSiguiente) {
        forwardConstraints.push(startAfter(opciones.cursorSiguiente));
    }
    forwardConstraints.push(limit(PAGE_SIZE + 1));

    const qNext = query(colRef, ...forwardConstraints);
    const snapNext = await getDocs(qNext);

    const hayMas = snapNext.docs.length > PAGE_SIZE;
    const docsPagina = hayMas ? snapNext.docs.slice(0, PAGE_SIZE) : snapNext.docs;

    return {
        items: docsPagina.map(mapDocToContenido),
        primerDoc: docsPagina.length > 0 ? docsPagina[0] : null,
        ultimoDoc: docsPagina.length > 0 ? docsPagina[docsPagina.length - 1] : null,
        hayMas,
    };
};

// Patrón 4: Obtener un título específico por ID de documento
export const obtenerContenidoPorId = async (
    idDocumento: string
): Promise<ContenidoCatalogo | null> => {
    const docRef = doc(db, COLLECTION_NAME, idDocumento.trim());
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<ContenidoCatalogo, "id">),
    };
};