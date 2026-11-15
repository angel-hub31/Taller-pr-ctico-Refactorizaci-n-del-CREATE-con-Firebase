import { ProductoForm } from "./components/ProductoForm";
import "./App.css";
import { ProductoLista } from "./components/ProductoLista";

function App() {
  return (
    <main className="container">
      <ProductoForm />
      <ProductoLista/>
    </main>
  );
}

export default App;