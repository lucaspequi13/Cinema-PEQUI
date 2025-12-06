import { Link } from "react-router-dom";


export const Nav = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.85) 0%, rgba(255, 165, 0, 0.85) 100%), url(/posters/Pequi.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <i className="bi bi-film" style={{color: '#333'}}></i> <strong style={{color: '#333', textShadow: '1px 1px 2px rgba(255,255,255,0.5)'}}>🍊 Cinema do Pequi Cerrado</strong>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/filmes">
                                    <i className="bi bi-film"></i> Filmes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/salas">
                                    <i className="bi bi-door-closed"></i> Salas
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/sessoes">
                                    <i className="bi bi-calendar-event"></i> Sessões
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin">
                                    <i className="bi bi-sliders"></i> Admin
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/usuario">
                                    <i className="bi bi-person-circle"></i> Usuário
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/minhas-compras">
                                    <i className="bi bi-ticket-perforated"></i> Minhas Compras
                                </Link>
                            </li>
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