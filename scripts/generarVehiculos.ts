import { addDoc, collection } from "firebase/firestore";
import { db } from "../src/firebase";

export interface Vehiculo {
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    anio: number;
    tipo: string;
};

const vehiculos: Vehiculo[] = [
    // Sedan
    { marca: "Toyota", modelo: "Corolla", precio: 24500, stock: 8, anio: 2025, tipo: "Sedan" },
    { marca: "Honda", modelo: "Civic", precio: 27800, stock: 3, anio: 2024, tipo: "Sedan" },
    { marca: "Mazda", modelo: "Mazda 3", precio: 23900, stock: 12, anio: 2023, tipo: "Sedan" },
    { marca: "Hyundai", modelo: "Elantra", precio: 22500, stock: 0, anio: 2026, tipo: "Sedan" },
    { marca: "Nissan", modelo: "Sentra", precio: 19800, stock: 9, anio: 2021, tipo: "Sedan" },
    { marca: "Kia", modelo: "Cerato", precio: 21000, stock: 6, anio: 2020, tipo: "Sedan" },

    // SUV
    { marca: "Toyota", modelo: "RAV4", precio: 36500, stock: 7, anio: 2025, tipo: "SUV" },
    { marca: "Kia", modelo: "Sportage", precio: 32000, stock: 5, anio: 2024, tipo: "SUV" },
    { marca: "Hyundai", modelo: "Tucson", precio: 36800, stock: 11, anio: 2026, tipo: "SUV" },
    { marca: "Chevrolet", modelo: "Tracker", precio: 21900, stock: 14, anio: 2023, tipo: "SUV" },
    { marca: "Ford", modelo: "Explorer", precio: 52000, stock: 0, anio: 2024, tipo: "SUV" },
    { marca: "Toyota", modelo: "Prado", precio: 58500, stock: 2, anio: 2025, tipo: "SUV" },

    // Pickup
    { marca: "Ford", modelo: "Ranger", precio: 41000, stock: 0, anio: 2023, tipo: "Pickup" },
    { marca: "Toyota", modelo: "Hilux", precio: 44500, stock: 6, anio: 2025, tipo: "Pickup" },
    { marca: "Chevrolet", modelo: "D-Max", precio: 34900, stock: 10, anio: 2022, tipo: "Pickup" },
    { marca: "Nissan", modelo: "Frontier", precio: 38200, stock: 4, anio: 2024, tipo: "Pickup" },

    // Hatchback
    { marca: "Chevrolet", modelo: "Onix", precio: 16500, stock: 12, anio: 2022, tipo: "Hatchback" },
    { marca: "Toyota", modelo: "Yaris", precio: 17800, stock: 18, anio: 2023, tipo: "Hatchback" },
    { marca: "Kia", modelo: "Picanto", precio: 15200, stock: 20, anio: 2021, tipo: "Hatchback" },
    { marca: "Suzuki", modelo: "Swift", precio: 18900, stock: 0, anio: 2025, tipo: "Hatchback" },
];


export const generarVehiculos = async () => {

    for (const vehiculo of vehiculos) {
        const referenciaVehiculo=await addDoc(collection(db, "vehiculos"), vehiculo)
        console.log("vehiculo registrado con id: ", referenciaVehiculo.id);
    }
    console.log("vehiculos generados exitosamente");
};

generarVehiculos();