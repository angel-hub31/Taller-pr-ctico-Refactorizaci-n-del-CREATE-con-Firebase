import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/firebase";

export interface Vehiculo {
    id?: string;
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    anio: number;
    tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback";
}