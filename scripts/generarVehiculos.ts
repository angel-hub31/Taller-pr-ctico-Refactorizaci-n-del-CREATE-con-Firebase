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

const vehiculosPrueba: Omit<Vehiculo, "id">[] = [
    { marca: "Toyota", modelo: "Corolla", precio: 24500, stock: 8, anio: 2025, tipo: "Sedan" },
    { marca: "Hyundai", modelo: "Tucson", precio: 32000, stock: 5, anio: 2024, tipo: "SUV" },
    { marca: "Chevrolet", modelo: "D-Max", precio: 38500, stock: 6, anio: 2025, tipo: "Pickup" },
    { marca: "Mazda", modelo: "3 Hatchback", precio: 26800, stock: 4, anio: 2023, tipo: "Hatchback" },
    { marca: "Kia", modelo: "Sportage", precio: 34900, stock: 0, anio: 2026, tipo: "SUV" },
    { marca: "Nissan", modelo: "Sentra", precio: 22900, stock: 7, anio: 2024, tipo: "Sedan" },
    { marca: "Ford", modelo: "Ranger", precio: 45000, stock: 3, anio: 2025, tipo: "Pickup" },
    { marca: "Volkswagen", modelo: "Golf", precio: 28500, stock: 2, anio: 2022, tipo: "Hatchback" },
    { marca: "Honda", modelo: "Civic", precio: 27400, stock: 9, anio: 2026, tipo: "Sedan" },
    { marca: "Toyota", modelo: "RAV4", precio: 39800, stock: 5, anio: 2025, tipo: "SUV" },
    { marca: "Mitsubishi", modelo: "L200", precio: 36200, stock: 0, anio: 2023, tipo: "Pickup" },
    { marca: "Suzuki", modelo: "Swift", precio: 17800, stock: 12, anio: 2024, tipo: "Hatchback" },
    { marca: "Hyundai", modelo: "Elantra", precio: 21500, stock: 6, anio: 2023, tipo: "Sedan" },
    { marca: "Jeep", modelo: "Compass", precio: 35600, stock: 4, anio: 2022, tipo: "SUV" },
    { marca: "Toyota", modelo: "Hilux", precio: 48900, stock: 7, anio: 2026, tipo: "Pickup" },
    { marca: "Peugeot", modelo: "208", precio: 19900, stock: 10, anio: 2025, tipo: "Hatchback" },
    { marca: "Kia", modelo: "Cerato", precio: 20400, stock: 3, anio: 2021, tipo: "Sedan" },
    { marca: "Chery", modelo: "Tiggo 7 Pro", precio: 29500, stock: 8, anio: 2024, tipo: "SUV" },
    { marca: "Nissan", modelo: "Frontier", precio: 41200, stock: 5, anio: 2024, tipo: "Pickup" },
    { marca: "Chevrolet", modelo: "Onix", precio: 16500, stock: 0, anio: 2020, tipo: "Hatchback" },
    { marca: "Mazda", modelo: "6", precio: 31000, stock: 2, anio: 2023, tipo: "Sedan" },
    { marca: "Ford", modelo: "Territory", precio: 33400, stock: 6, anio: 2026, tipo: "SUV" }
];