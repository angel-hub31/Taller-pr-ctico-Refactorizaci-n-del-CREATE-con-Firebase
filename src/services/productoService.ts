import { collection, addDoc, getDocs, updateDoc,doc } from "firebase/firestore";
import {db} from "../firebase";

export interface Producto{
    id: string;
    nombre: string;
    precio: number;
    stock: number;
}

export const crearProducto = async(producto: Omit<Producto, "id">)=>{
    const docRef = await addDoc(collection(db, "productos"),{
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock
    });
    return docRef.id;
}

export const obtenerProductos = async(): Promise<Producto[]>=>{
    const querySnapshot = await getDocs(collection(db,"productos"));

    const productos =querySnapshot.docs.map((docs)=>{
        return {
            id: docs.id,
            ...docs.data()
        };
        
    }) as Producto[];

    return productos;
}

export const actualizarProducto = async( id: string,
    nombre: string,
    precio: number,
    stock: number

)=>{

   const productoRef= doc(db,"productos", id);

   await updateDoc(productoRef,{
    nombre,
    precio,
    stock
   })

}