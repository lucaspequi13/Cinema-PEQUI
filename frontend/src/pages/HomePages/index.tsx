import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterModal } from '../../components/RegisterModal/RegisterModal';

export const HomePages = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="hero-section" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.8) 100%), url(/posters/Pequi.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#333',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{position: 'absolute', top: '20px', right: '30px', fontSize: '60px', opacity: '0.15'}}>🍊</div>
        <div style={{position: 'absolute', bottom: '20px', left: '30px', fontSize: '50px', opacity: '0.15'}}>🍊</div>
        <h1 className="display-3 fw-bold mb-4" style={{position: 'relative', zIndex: 1}}>🍊 Bem-vindo ao Cinema do Pequi Cerrado</h1>
        <p className="lead mb-4" style={{position: 'relative', zIndex: 1}}>Compre seus ingressos online de forma rápida e segura</p>
        <button 
          className="btn btn-dark btn-lg"
          onClick={() => setShowRegister(true)}
          style={{position: 'relative', zIndex: 1}}
        >
          <i className="bi bi-person-plus"></i> Registrar
        </button>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-film display-4 text-primary mb-3" style={{ fontSize: '50px' }}></i>
                <h5 className="card-title">Filmes em Cartaz</h5>
                <p className="card-text">Confira todos os filmes disponíveis no Cinema do Pequi Cerrado</p>
                <Link to="/filmes" className="btn btn-primary">
                  Explorar Filmes
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-door-closed display-4 text-success mb-3" style={{ fontSize: '50px' }}></i>
                <h5 className="card-title">Nossas Salas</h5>
                <p className="card-text">Conheça as salas disponíveis com diferentes tecnologias</p>
                <Link to="/salas" className="btn btn-success">
                  Ver Salas
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-event display-4 text-info mb-3" style={{ fontSize: '50px' }}></i>
                <h5 className="card-title">Sessões</h5>
                <p className="card-text">Escolha o melhor horário para assistir seu filme favorito</p>
                <Link to="/sessoes" className="btn btn-info">
                  Ver Sessões
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 pt-5 border-top">
          <div className="col-12">
            <h2 className="text-center mb-4">Por que escolher o Cinema do Pequi Cerrado?</h2>
          </div>
          <div className="col-md-6 mb-4">
            <div className="d-flex gap-3">
              <div style={{ minWidth: '50px' }}>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h6>Compra Online Fácil</h6>
                <p className="text-muted">Sistema simples e intuitivo para comprar seus ingressos</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="d-flex gap-3">
              <div style={{ minWidth: '50px' }}>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h6>Salas Modernas</h6>
                <p className="text-muted">Tecnologia de ponta para a melhor experiência</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="d-flex gap-3">
              <div style={{ minWidth: '50px' }}>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h6>Melhor Preço</h6>
                <p className="text-muted">Promoções e preços especiais para assinantes</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="d-flex gap-3">
              <div style={{ minWidth: '50px' }}>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '24px' }}></i>
              </div>
              <div>
                <h6>Segurança Garantida</h6>
                <p className="text-muted">Seus dados protegidos com a melhor criptografia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
};