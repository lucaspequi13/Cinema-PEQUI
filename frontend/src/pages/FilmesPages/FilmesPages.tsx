import { useState, useEffect } from 'react';
import type { IFilme } from '../../models/filme.model';
import { filmeService } from '../../services/filme.service';
import './FilmesPages.css';

export function FilmesPages() {
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filmeSelected, setFilmeSelected] = useState<IFilme | null>(null);

  useEffect(() => {
    carregarFilmes();
  }, []);

  const carregarFilmes = async () => {
    try {
      setLoading(true);
      const dados = await filmeService.listar();
      setFilmes(dados);
      setError(null);
    } catch (erro) {
      console.error('Erro ao carregar filmes:', erro);
      setError('Erro ao carregar filmes. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const getClassificacaoBadgeColor = (classificacao: string) => {
    const colors: Record<string, string> = {
      'L': 'bg-success',
      '10': 'bg-info',
      '12': 'bg-warning text-dark',
      '14': 'badge-orange',
      '16': 'bg-danger',
      '18': 'bg-dark text-light border border-light border-2',
    };
    return colors[classificacao] || 'bg-secondary';
  };

  const getClassificacaoBadgeStyle = (classificacao: string) => {
    if (classificacao === '12') {
      return { backgroundColor: '#FFE680', color: '#000' };
    } else if (classificacao === '14') {
      return { backgroundColor: '#FF9800', color: '#fff' };
    }
    return {};
  };

  const getClassificacaoIcon = (classificacao: string) => {
    const icons: Record<string, string> = {
      'L': '🟢',
      '10': '🔵',
      '12': '🟡',
      '14': '🟠',
      '16': '🔴',
      '18': '⚫',
    };
    return icons[classificacao] || '❓';
  };

  return (
    <div className="filmes-page">
      <div className="hero-filmes" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.8) 100%), url(/posters/Pequi.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#333',
        padding: '60px 20px',
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative'
      }}>
        <div style={{position: 'absolute', top: '15px', right: '20px', fontSize: '50px', opacity: '0.15'}}>🍊</div>
        <div style={{position: 'absolute', bottom: '15px', left: '20px', fontSize: '45px', opacity: '0.15'}}>🍊</div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <h1 className="display-3 fw-bold mb-3">
            <i className="bi bi-film"></i> Em Cartaz
          </h1>
          <p className="lead mb-0">🍊 Confira os melhores filmes em exibição no Cinema do Pequi Cerrado</p>
        </div>
      </div>

      <div className="container mb-5">
        <div className="classificacao-legenda mb-5">
          <h6 className="text-muted mb-3">Classificação Indicativa:</h6>
          <div className="d-flex flex-wrap gap-2">
            <span className={`badge ${getClassificacaoBadgeColor('L')} p-2`} style={{fontSize: '14px'}}>L - Livre</span>
            <span className={`badge ${getClassificacaoBadgeColor('10')} p-2`} style={{fontSize: '14px'}}>10 anos</span>
            <span className="badge p-2" style={{...getClassificacaoBadgeStyle('12'), fontSize: '14px'}}>12 anos</span>
            <span className="badge p-2" style={{...getClassificacaoBadgeStyle('14'), fontSize: '14px'}}>14 anos</span>
            <span className={`badge ${getClassificacaoBadgeColor('16')} p-2`} style={{fontSize: '14px'}}>16 anos</span>
            <span className={`badge ${getClassificacaoBadgeColor('18')} p-2`} style={{fontSize: '14px'}}>18 anos</span>
          </div>
        </div>

        {filmes.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle"></i> Nenhum filme disponível no momento.
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">Total de {filmes.length} filme(s) em exibição</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {filmes.map((filme) => (
                <div
                  key={filme.id}
                  onClick={() => setFilmeSelected(filme)}
                  style={{
                    background: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(/posters/Pequi fundos.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#f0f0f0',
                      width: '100%',
                      height: '0',
                      paddingBottom: '150%'
                    }}
                  >
                    <img
                      src={filme.poster}
                      alt={filme.titulo}
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                      }}
                    />
                  </div>
                  
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h6 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '15px' }}>
                      {filme.titulo}
                    </h6>
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666' }}>
                      {filme.genero}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <small style={{ color: '#888' }}>
                        <i className="bi bi-clock"></i> {filme.duracao} min
                      </small>
                      <small style={{ color: '#666' }}>
                        <strong>Dir:</strong> {filme.diretor}
                      </small>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                        <div style={{
                          padding: '8px 12px',
                          ...getClassificacaoBadgeStyle(filme.classificacao),
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          width: 'fit-content'
                        }}
                        className={getClassificacaoBadgeColor(filme.classificacao)}
                        >
                          <span style={{ fontSize: '16px' }}>{getClassificacaoIcon(filme.classificacao)}</span>
                          {filme.classificacao}
                        </div>
                        {filme.nota && (
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#FF6B35',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            🍅 {filme.nota}/10
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {filmeSelected && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1050
        }} onClick={() => setFilmeSelected(null)}>
          <div style={{
            background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(/posters/Pequi fundos.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setFilmeSelected(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            <h2 style={{ marginBottom: '15px', color: '#333', paddingRight: '40px' }}>
              {filmeSelected.titulo}
            </h2>

            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <span style={{
                padding: '6px 12px',
                ...getClassificacaoBadgeStyle(filmeSelected.classificacao),
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              className={getClassificacaoBadgeColor(filmeSelected.classificacao)}
              >
                <span style={{ fontSize: '18px' }}>{getClassificacaoIcon(filmeSelected.classificacao)}</span>
                {filmeSelected.classificacao}
              </span>
              {filmeSelected.nota && (
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🍅 {filmeSelected.nota}/10
                </span>
              )}
              <span style={{ fontSize: '14px', color: '#666' }}>
                <i className="bi bi-clock"></i> {filmeSelected.duracao} min
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {filmeSelected.genero}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                <strong>Diretor:</strong> {filmeSelected.diretor}
              </p>
              <p style={{ fontSize: '13px', color: '#888' }}>
                <strong>Lançamento:</strong> {new Date(filmeSelected.dataLancamento).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div style={{
              borderTop: '1px solid #eee',
              paddingTop: '20px'
            }}>
              <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Sinopse
              </h5>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#555',
                marginBottom: '0'
              }}>
                {filmeSelected.descricao}
              </p>
            </div>

            <button
              onClick={() => setFilmeSelected(null)}
              className="btn btn-danger mt-4 w-100"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
