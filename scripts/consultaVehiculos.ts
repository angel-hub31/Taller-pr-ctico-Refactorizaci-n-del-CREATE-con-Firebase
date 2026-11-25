import { db } from "../src/firebase";
import { getDocs, where, orderBy, query, collection } from "firebase/firestore";

export interface Vehiculo {
    id: string,
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    anio: number;
    tipo: string;
};


// Consulta 1

export const consulta1 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("stock", ">", 0),
        orderBy("precio", "asc")
    );

    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];
    return listaVehiculos;
}


// Consulta 2

export const consulta2 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("tipo", "==", "SUV"),
        where("stock", ">", 0),
        orderBy("precio", "asc")
    );

    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
}


// Consulta 3

export const consulta3 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("precio", ">=", 20000),
        where("precio", "<=", 40000),
        where("stock", ">", 0),
        orderBy("precio", "asc")
    );

    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
};


// Consulta 4 
export const consulta4 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("tipo", "==", "Sedan"),
        where("anio", ">=", 2023),
        where("stock", ">", 0),
        orderBy("anio", "desc")
    );

    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
};

export const consulta5 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("tipo", "==", "Deportivo"),
        where("stock", ">", 0),

        orderBy("precio", "asc")
    );




    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
};

export const consulta6 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("precio", ">=", 25000),
        where("precio", "<=", 45000),

        orderBy("precio", "asc")
    );




    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
};

export const consulta7 = async (): Promise<Vehiculo[]> => {
    const consultaArmada = query(
        collection(db, "vehiculos"),
        where("tipo", "==", "Pickup"),
        where("anio", ">=", 2024),
        where("stock", ">", 0),


        orderBy("anio", "desc")
    );




    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
};





//============================================================================
//OBTENER TODOS --- CONSULTA NORMAL--SIN QUERY
//============================================================================

export const obtenerVehiculos = async (): Promise<Vehiculo[]> => {
    const consultaArmada = collection(db, "vehiculos")

    const vehiculosEncontradosBDD = await getDocs(consultaArmada);// llegan datos crudos

    const listaVehiculos = vehiculosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Vehiculo[];

    return listaVehiculos;
};