import { Route, Routes } from "react-router-dom"
import { HomePages } from "../pages/HomePages"
import { SobrePages } from "../pages/SobrePages"
import { UsuarioPages } from "../pages/UsuarioPages"
import { FilmesPages } from "../pages/FilmesPages/FilmesPages"
import { SalasPages } from "../pages/SalasPages/SalasPages"
import { SessoesPages } from "../pages/SessoesPages/SessoesPages"
import { AdminPages } from "../pages/AdminPages/AdminPages"
import { MinhasComprasPages } from "../pages/MinhasComprasPages/MinhasComprasPages"


export const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<HomePages />} />
            <Route path="/sobre" element={<SobrePages />} />
            <Route path="/usuario" element={<UsuarioPages />} />
            <Route path="/minhas-compras" element={<MinhasComprasPages />} />
            <Route path="/filmes" element={<FilmesPages />} />
            <Route path="/salas" element={<SalasPages />} />
            <Route path="/sessoes" element={<SessoesPages />} />
            <Route path="/admin" element={<AdminPages />} />
        </Routes>
    </>
    )
}
