
// Funciones para manipular documentos y colecciones
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    onSnapshot
} from "firebase/firestore";

// Instancia configurada de la base de datos Firestore
import { db } from "../firebase";

// Interface que define la estructura de un producto
export interface Producto {
    id: string;
    nombre: string;
    precio: number;
    stock: number;
    categoria: string;
}

// Crea un nuevo documento en la colección "productos"
export const crearProducto = async (producto: Omit<Producto, "id">) => {

    const docRef = await addDoc(collection(db, "productos"), {
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,

    });

    // Retorna el ID único asignado
    return docRef.id;
};

// Obtiene todos los documentos de la colección "productos"
export const obtenerProductos = async (): Promise<Producto[]> => {

    const querySnapshot = await getDocs(collection(db, "productos"));

    const productos = querySnapshot.docs.map((docs) => {
        return {
            id: docs.id,
            ...docs.data()
        };
    }) as Producto[];

    return productos;
};

// Escucha los productos en tiempo real utilizando onSnapshot()
export const escucharProductos = (
    callback: (productos: Producto[]) => void
) => {

    const productosRef = collection(db, "productos");

    const unsubscribe = onSnapshot(productosRef, (querySnapshot) => {

        // Transforma los documentos de Firestore en un arreglo
        const productos = querySnapshot.docs.map((docs) => {
            return {
                id: docs.id,
                ...docs.data()
            };
        }) as Producto[];

        // Envía los productos actualizados al componente
        callback(productos);

    }, (error) => {
        console.error("Error al escuchar productos:", error);
    });

    // Retorna la función para cancelar la escucha
    return unsubscribe;
};

// Actualiza los campos de un producto existente
export const actualizarProducto = async (
    id: string,
    nombre: string,
    precio: number,
    stock: number,
    categoria: string,
) => {

    const productoRef = doc(db, "productos", id);

    await updateDoc(productoRef, {
        nombre,
        precio,
        stock,
        categoria
    });

};

// Elimina un producto existente
export const eliminarProducto = async (id: string) => {

    const productoRef = doc(db, "productos", id);

    await deleteDoc(productoRef);

};
