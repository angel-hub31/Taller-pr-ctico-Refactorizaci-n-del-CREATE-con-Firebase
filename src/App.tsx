import { useState, type FormEvent } from 'react'
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";


import './App.css'

function App() {
  // variables que de la base de datos
  const [nombre, setnombre] = useState("");
  const [precio, setprecio] = useState("");
  const [stock, setstock] = useState("");

  //e : variable de evento  e= evento
  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      const docRef = await addDoc(collection(db, "productos"), {
        nombre: nombre,
        precio: Number(precio),
        stock: Number(stock),

      });

      console.log("Producto creado: ", docRef.id)

      setnombre("");
      setprecio("");
      setstock("");


    } catch (error) {
      console.log("error :" + error)
    }

  }

  return (
    <div>
      <h1>
        Registro de productos
      </h1>
      <form onSubmit={guardarProducto}>
        <input

          type="text" //tipo de dato
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setnombre(e.target.value)}
        />

        <input

          type="number" //tipo de dato
          placeholder="Precio"
          value={precio}
          onChange={(e) => setprecio(e.target.value)}
        />

        <input

          type="number" //tipo de dato
          placeholder="Stock"
          value={stock}
          onChange={(e) => setstock(e.target.value)}
        />

        <button type="submit">Guardar</button>




      </form>
    </div>


  )
}

export default App
