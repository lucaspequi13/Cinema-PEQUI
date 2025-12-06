// ============================================
// COMPONENTE: NAVEGAÇÃO (NAVBAR)
// ============================================
// Barra de navegação do Cinema do Pequi Cerrado
// Permite navegar entre as páginas principais

import { Link } from "react-router-dom";

// ===== FUNÇÃO: NAV =====
// Renderiza a barra de navegação com links para todas as páginas
export const Nav = () => {
    return (
        <>
            {/* NAVBAR Bootstrap com tema Pequi */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3" style={{
                // Fundo com gradiente amarelo/laranja + imagem Pequi
                backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.85) 0%, rgba(255, 165, 0, 0.85) 100%), url(/posters/Pequi.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed' // Paralaxe
            }}>
                <div className="container-fluid">
                    {/* LOGO - Link para Home */}
                    <Link className="navbar-brand" to="/">
                        <i className="bi bi-film" style={{color: '#333'}}></i> 
                        <strong style={{color: '#333', textShadow: '1px 1px 2px rgba(255,255,255,0.5)'}}>
                            🍊 Cinema do Pequi Cerrado
                        </strong>
                    </Link>
                    
                    {/* Botão para expandir menu em telas pequenas */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    {/* MENU DE NAVEGAÇÃO */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {/* Link: Home */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/">Home</Link>
                            </li>
                            
                            {/* Link: Filmes em Cartaz */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/filmes">
                                    <i className="bi bi-film"></i> Filmes
                                </Link>
                            </li>
                            
                            {/* Link: Salas de Cinema */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/salas">
                                    <i className="bi bi-door-closed"></i> Salas
                                </Link>
                            </li>
                            
                            {/* Link: Sessões/Horários */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/sessoes">
                                    <i className="bi bi-calendar-event"></i> Sessões
                                </Link>
                            </li>
                            
                            {/* Link: Painel Admin */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin">
                                    <i className="bi bi-sliders"></i> Admin
                                </Link>
                            </li>
                            
                            {/* Link: Perfil do Usuário */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/usuario">
                                    <i className="bi bi-person-circle"></i> Usuário
                                </Link>
                            </li>
                            
                            {/* Link: Histórico de Compras */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/minhas-compras">
                                    <i className="bi bi-ticket-perforated"></i> Minhas Compras
                                </Link>
                            </li>
                            
                            {/* Link: Página Sobre */}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/sobre">
                                    <i className="bi bi-info-circle"></i> Sobre
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}