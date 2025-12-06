// ============================================
// COMPONENTE PRINCIPAL APP
// ============================================
// Este é o componente raiz da aplicação.
// Renderiza o Navbar e o sistema de rotas.

import { Nav } from "./components/Nav"
import { AppRouter } from "./routers/app.routers"
import "./App.css" // Estilos globais com backgrounds de Pequi

// ===== FUNÇÃO: APP =====
// Componente funcional que estrutura a layout principal
function App() {
  return (
    <>
      {/* Navbar com logo e tema Pequi */}
      <Nav/>
      
      {/* Sistema de rotas - renderiza páginas conforme URL */}
      <AppRouter/>
    </>
  )
}

export default App
