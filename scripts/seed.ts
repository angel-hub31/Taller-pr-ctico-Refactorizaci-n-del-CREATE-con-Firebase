import { setDoc, doc } from "firebase/firestore";
// Importa db directamente desde src/firebase.ts
import { db } from "../src/firebase";

export interface FichaTecnica {
    idiomaOriginal: string;
    clasificacion: string;
    duracionOTemporadas: string;
}

export interface ContenidoSeed {
    id: string;
    titulo: string;
    tipo: "pelicula" | "serie";
    genero: string;
    anioEstreno: number;
    calificacion: number;
    disponible: boolean;
    ficha: FichaTecnica;
}

const contenidosSeed: ContenidoSeed[] = [
    { id: "TIT001", titulo: "Interestelar", tipo: "pelicula", genero: "Ciencia Ficción", anioEstreno: 2014, calificacion: 8.7, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG-13", duracionOTemporadas: "169 min" } },
    { id: "TIT002", titulo: "Dark", tipo: "serie", genero: "Ciencia Ficción", anioEstreno: 2017, calificacion: 8.8, disponible: true, ficha: { idiomaOriginal: "Alemán", clasificacion: "TV-MA", duracionOTemporadas: "3 temporadas" } },
    { id: "TIT003", titulo: "Hereditary", tipo: "pelicula", genero: "Terror", anioEstreno: 2018, calificacion: 7.3, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "127 min" } },
    { id: "TIT004", titulo: "El Pianista", tipo: "pelicula", genero: "Drama", anioEstreno: 2002, calificacion: 8.5, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "150 min" } },
    { id: "TIT005", titulo: "All of Us Are Dead", tipo: "serie", genero: "Terror", anioEstreno: 2022, calificacion: 7.5, disponible: true, ficha: { idiomaOriginal: "Coreano", clasificacion: "TV-MA", duracionOTemporadas: "1 temporada" } },
    { id: "TIT006", titulo: "Soy Leyenda", tipo: "pelicula", genero: "Ciencia Ficción", anioEstreno: 2007, calificacion: 7.2, disponible: false, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG-13", duracionOTemporadas: "101 min" } },
    { id: "TIT007", titulo: "South Park", tipo: "serie", genero: "Animación", anioEstreno: 1997, calificacion: 8.7, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-MA", duracionOTemporadas: "26 temporadas" } },
    { id: "TIT008", titulo: "Apocalypto", tipo: "pelicula", genero: "Acción", anioEstreno: 2006, calificacion: 7.8, disponible: true, ficha: { idiomaOriginal: "Yucateco", clasificacion: "R", duracionOTemporadas: "139 min" } },
    { id: "TIT009", titulo: "In Time", tipo: "pelicula", genero: "Ciencia Ficción", anioEstreno: 2011, calificacion: 6.7, disponible: false, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG-13", duracionOTemporadas: "109 min" } },
    { id: "TIT010", titulo: "El Perfume", tipo: "pelicula", genero: "Drama", anioEstreno: 2006, calificacion: 7.5, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "147 min" } },
    { id: "TIT011", titulo: "Piratas del Caribe: El Cofre de la Muerte", tipo: "pelicula", genero: "Acción", anioEstreno: 2006, calificacion: 7.4, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG-13", duracionOTemporadas: "151 min" } },
    { id: "TIT012", titulo: "La Caída", tipo: "pelicula", genero: "Drama", anioEstreno: 2004, calificacion: 8.2, disponible: false, ficha: { idiomaOriginal: "Alemán", clasificacion: "R", duracionOTemporadas: "156 min" } },
    { id: "TIT013", titulo: "Tetris", tipo: "pelicula", genero: "Drama", anioEstreno: 2023, calificacion: 7.4, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "118 min" } },
    { id: "TIT014", titulo: "The Black Phone", tipo: "pelicula", genero: "Terror", anioEstreno: 2021, calificacion: 6.9, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "103 min" } },
    { id: "TIT015", titulo: "Georgie & Mandy's First Marriage", tipo: "serie", genero: "Comedia", anioEstreno: 2024, calificacion: 7.1, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-PG", duracionOTemporadas: "1 temporada" } },
    { id: "TIT016", titulo: "Avengers: Endgame", tipo: "pelicula", genero: "Acción", anioEstreno: 2019, calificacion: 8.4, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG-13", duracionOTemporadas: "181 min" } },
    { id: "TIT017", titulo: "El Juego del Calamar", tipo: "serie", genero: "Drama", anioEstreno: 2021, calificacion: 8.0, disponible: true, ficha: { idiomaOriginal: "Coreano", clasificacion: "TV-MA", duracionOTemporadas: "2 temporadas" } },
    { id: "TIT018", titulo: "Chucky: El Muñeco Diabólico", tipo: "pelicula", genero: "Terror", anioEstreno: 1988, calificacion: 6.7, disponible: false, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "87 min" } },
    { id: "TIT019", titulo: "Blade Runner 2049", tipo: "pelicula", genero: "Ciencia Ficción", anioEstreno: 2017, calificacion: 8.0, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "164 min" } },
    { id: "TIT020", titulo: "Breaking Bad", tipo: "serie", genero: "Drama", anioEstreno: 2008, calificacion: 9.5, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-MA", duracionOTemporadas: "5 temporadas" } },
    { id: "TIT021", titulo: "Mad Max: Furia en el Camino", tipo: "pelicula", genero: "Acción", anioEstreno: 2015, calificacion: 8.1, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "120 min" } },
    { id: "TIT022", titulo: "El Viaje de Chihiro", tipo: "pelicula", genero: "Animación", anioEstreno: 2001, calificacion: 8.6, disponible: true, ficha: { idiomaOriginal: "Japonés", clasificacion: "PG", duracionOTemporadas: "125 min" } },
    { id: "TIT023", titulo: "Stranger Things", tipo: "serie", genero: "Ciencia Ficción", anioEstreno: 2016, calificacion: 8.7, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-14", duracionOTemporadas: "4 temporadas" } },
    { id: "TIT024", titulo: "El Conjuro", tipo: "pelicula", genero: "Terror", anioEstreno: 2013, calificacion: 7.5, disponible: false, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "112 min" } },
    { id: "TIT025", titulo: "The Office", tipo: "serie", genero: "Comedia", anioEstreno: 2005, calificacion: 9.0, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-14", duracionOTemporadas: "9 temporadas" } },
    { id: "TIT026", titulo: "Dune: Parte Dos", tipo: "pelicula", genero: "Ciencia Ficción", anioEstreno: 2024, calificacion: 8.5, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG-13", duracionOTemporadas: "166 min" } },
    { id: "TIT027", titulo: "Spider-Man: Un Nuevo Universo", tipo: "pelicula", genero: "Animación", anioEstreno: 2018, calificacion: 8.4, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "PG", duracionOTemporadas: "117 min" } },
    { id: "TIT028", titulo: "Better Call Saul", tipo: "serie", genero: "Drama", anioEstreno: 2015, calificacion: 9.0, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-MA", duracionOTemporadas: "6 temporadas" } },
    { id: "TIT029", titulo: "John Wick 4", tipo: "pelicula", genero: "Acción", anioEstreno: 2023, calificacion: 7.7, disponible: false, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "169 min" } },
    { id: "TIT030", titulo: "Arcane", tipo: "serie", genero: "Animación", anioEstreno: 2021, calificacion: 9.0, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-14", duracionOTemporadas: "2 temporadas" } },
    { id: "TIT031", titulo: "Parásitos", tipo: "pelicula", genero: "Drama", anioEstreno: 2019, calificacion: 8.5, disponible: true, ficha: { idiomaOriginal: "Coreano", clasificacion: "R", duracionOTemporadas: "132 min" } },
    { id: "TIT032", titulo: "Severance", tipo: "serie", genero: "Ciencia Ficción", anioEstreno: 2022, calificacion: 8.7, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-MA", duracionOTemporadas: "2 temporadas" } },
    { id: "TIT033", titulo: "El Resplandor", tipo: "pelicula", genero: "Terror", anioEstreno: 1980, calificacion: 8.4, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "146 min" } },
    { id: "TIT034", titulo: "Brooklyn Nine-Nine", tipo: "serie", genero: "Comedia", anioEstreno: 2013, calificacion: 8.4, disponible: false, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-14", duracionOTemporadas: "8 temporadas" } },
    { id: "TIT035", titulo: "Gladiador", tipo: "pelicula", genero: "Acción", anioEstreno: 2000, calificacion: 8.5, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "155 min" } },
    { id: "TIT036", titulo: "Attack on Titan", tipo: "serie", genero: "Animación", anioEstreno: 2013, calificacion: 9.1, disponible: true, ficha: { idiomaOriginal: "Japonés", clasificacion: "TV-MA", duracionOTemporadas: "4 temporadas" } },
    { id: "TIT037", titulo: "Oppenheimer", tipo: "pelicula", genero: "Drama", anioEstreno: 2023, calificacion: 8.3, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "R", duracionOTemporadas: "180 min" } },
    { id: "TIT038", titulo: "The Boys", tipo: "serie", genero: "Acción", anioEstreno: 2019, calificacion: 8.7, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-MA", duracionOTemporadas: "4 temporadas" } },
    { id: "TIT039", titulo: "Coco", tipo: "pelicula", genero: "Animación", anioEstreno: 2017, calificacion: 8.4, disponible: false, ficha: { idiomaOriginal: "Español", clasificacion: "PG", duracionOTemporadas: "105 min" } },
    { id: "TIT040", titulo: "Succession", tipo: "serie", genero: "Drama", anioEstreno: 2018, calificacion: 8.9, disponible: true, ficha: { idiomaOriginal: "Inglés", clasificacion: "TV-MA", duracionOTemporadas: "4 temporadas" } },
];

const seedCatalogo = async (): Promise<void> => {
    console.log(`Sembrando ${contenidosSeed.length} documentos en 'catalogo'...`);

    for (const item of contenidosSeed) {
        const { id, ...datosDocumento } = item;
        // Crea o sobrescribe el documento con ID personalizado (TIT001..TIT040)
        await setDoc(doc(db, "catalogo", id), datosDocumento);
        console.log(`Guardado: ${id} -> ${item.titulo}`);
    }

    console.log("Siembra finalizada.");
};

seedCatalogo().catch((error) => {
    console.error("Error en la siembra:", error);
throw error;

});