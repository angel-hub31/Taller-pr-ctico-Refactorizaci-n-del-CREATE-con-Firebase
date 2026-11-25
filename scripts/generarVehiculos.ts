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

    { marca: "Toyota", modelo: "Corolla", precio: 24500, stock: 8, anio: 2025, tipo: "Deportivo" },
    { marca: "Honda", modelo: "Civic", precio: 27800, stock: 3, anio: 2024, tipo: "Deportivo" },
    { marca: "Mazda", modelo: "Mazda 3", precio: 23900, stock: 12, anio: 2023, tipo: "Deportivo" },
    { marca: "Hyundai", modelo: "Elantra", precio: 22500, stock: 0, anio: 2026, tipo: "Deportivo" },
    { marca: "Nissan", modelo: "Sentra", precio: 19800, stock: 9, anio: 2021, tipo: "Deportivo" },
    { marca: "Kia", modelo: "Cerato", precio: 21000, stock: 6, anio: 2020, tipo: "Deportivo" },


    { marca: "Volkswagen", modelo: "Jetta", precio: 25400, stock: 5, anio: 2024, tipo: "Sedan" },
    { marca: "Chevrolet", modelo: "Onix Plus", precio: 18200, stock: 9, anio: 2023, tipo: "Sedan" },
    { marca: "Ford", modelo: "Escape", precio: 34500, stock: 4, anio: 2024, tipo: "SUV" },
    { marca: "Mazda", modelo: "CX-5", precio: 33900, stock: 7, anio: 2025, tipo: "SUV" },
    { marca: "Nissan", modelo: "Kicks", precio: 22800, stock: 11, anio: 2023, tipo: "SUV" },
    { marca: "Volkswagen", modelo: "T-Cross", precio: 24900, stock: 6, anio: 2024, tipo: "SUV" },
    { marca: "Toyota", modelo: "Tacoma", precio: 46800, stock: 3, anio: 2025, tipo: "Pickup" },
    { marca: "Volkswagen", modelo: "Amarok", precio: 43200, stock: 5, anio: 2024, tipo: "Pickup" },
    { marca: "Ford", modelo: "Maverick", precio: 31500, stock: 8, anio: 2023, tipo: "Pickup" },
    { marca: "Volkswagen", modelo: "Polo", precio: 19400, stock: 10, anio: 2024, tipo: "Hatchback" },
    { marca: "Hyundai", modelo: "i20", precio: 17600, stock: 7, anio: 2022, tipo: "Hatchback" },
    { marca: "Mazda", modelo: "Mazda 2", precio: 18500, stock: 6, anio: 2023, tipo: "Hatchback" },
    { marca: "Ford", modelo: "Mustang", precio: 48900, stock: 2, anio: 2025, tipo: "Deportivo" },
    { marca: "Toyota", modelo: "GR86", precio: 38700, stock: 4, anio: 2024, tipo: "Deportivo" },


    { marca: "Hyundai", modelo: "Accent", precio: 17200, stock: 8, anio: 2023, tipo: "Sedan" },
    { marca: "Kia", modelo: "Seltos", precio: 26400, stock: 5, anio: 2024, tipo: "SUV" },
    { marca: "Chevrolet", modelo: "Montana", precio: 29800, stock: 4, anio: 2024, tipo: "Pickup" },
    { marca: "Nissan", modelo: "Versa", precio: 18100, stock: 11, anio: 2023, tipo: "Hatchback" },
    { marca: "Subaru", modelo: "BRZ", precio: 37900, stock: 2, anio: 2024, tipo: "Deportivo" },
    { marca: "Honda", modelo: "CR-V", precio: 39500, stock: 6, anio: 2025, tipo: "SUV" },
    { marca: "Mazda", modelo: "BT-50", precio: 36200, stock: 3, anio: 2023, tipo: "Pickup" },


];

export const generarVehiculos = async () => {

    for (const vehiculo of vehiculos) {
        const referenciaVehiculo = await addDoc(collection(db, "vehiculos"), vehiculo)
        console.log("vehiculo registrado con id: ", referenciaVehiculo.id);
    }
    console.log("vehiculos generados exitosamente");
};

generarVehiculos();