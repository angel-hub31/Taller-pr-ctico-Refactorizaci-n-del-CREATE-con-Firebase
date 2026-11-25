import {
    collection,
    endBefore,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter,
    type DocumentData,
    type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../src/firebase";

export interface Vehiculo {
    id: string;
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    anio: number;
    tipo: string;
}

export interface ResultadoPagina {
    vehiculos: Vehiculo[];
    primerDoc: QueryDocumentSnapshot<DocumentData> | null;
    ultimoDoc: QueryDocumentSnapshot<DocumentData> | null;
    hayMas: boolean;
}

const TAMANO_PAGINA = 10;
const coleccionVehiculos = collection(db, "vehiculos");

const mapearDocumentos = (docs: QueryDocumentSnapshot<DocumentData>[]): Vehiculo[] =>
    docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Vehiculo, "id">),
    }));

// Página 1: orderBy + limit(10)
export const obtenerPrimeraPaginaVehiculos = async (): Promise<ResultadoPagina> => {
    const consulta = query(
        coleccionVehiculos,
        orderBy("marca", "asc"),
        orderBy("__name__", "asc"),
        limit(TAMANO_PAGINA + 1)
    );

    const snapshot = await getDocs(consulta);
    const hayMas = snapshot.docs.length > TAMANO_PAGINA;
    const docsPagina = hayMas ? snapshot.docs.slice(0, TAMANO_PAGINA) : snapshot.docs;

    return {
        vehiculos: mapearDocumentos(docsPagina),
        primerDoc: docsPagina[0] ?? null,
        ultimoDoc: docsPagina[docsPagina.length - 1] ?? null,
        hayMas,
    };
};

export const obtenerSiguientePaginaVehiculos = async (
    ultimoDoc: QueryDocumentSnapshot<DocumentData>
): Promise<ResultadoPagina> => {
    const consulta = query(
        coleccionVehiculos,
        orderBy("marca", "asc"),
        orderBy("__name__", "asc"),
        startAfter(ultimoDoc),
        limit(TAMANO_PAGINA + 1)
    );

    const snapshot = await getDocs(consulta);
    const hayMas = snapshot.docs.length > TAMANO_PAGINA;
    const docsPagina = hayMas ? snapshot.docs.slice(0, TAMANO_PAGINA) : snapshot.docs;

    return {
        vehiculos: mapearDocumentos(docsPagina),
        primerDoc: docsPagina[0] ?? null,
        ultimoDoc: docsPagina[docsPagina.length - 1] ?? null,
        hayMas,
    };
};

export const obtenerPaginaAnteriorVehiculos = async (
    primerDoc: QueryDocumentSnapshot<DocumentData>
): Promise<ResultadoPagina> => {
    const consulta = query(
        coleccionVehiculos,
        orderBy("marca", "asc"),
        orderBy("__name__", "asc"),
        endBefore(primerDoc),
        limitToLast(TAMANO_PAGINA)
    );

    const snapshot = await getDocs(consulta);
    const docsPagina = snapshot.docs;

    return {
        vehiculos: mapearDocumentos(docsPagina),
        primerDoc: docsPagina[0] ?? null,
        ultimoDoc: docsPagina[docsPagina.length - 1] ?? null,
        hayMas: docsPagina.length === TAMANO_PAGINA,
    };
};