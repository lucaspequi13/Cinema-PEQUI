// ============================================
// PÁGINA DE FILMES - Cinema do Pequi Cerrado
// ============================================
// Esta página exibe todos os filmes disponíveis em um grid responsivo.
// Permite visualizar a sinopse de cada filme em um modal.

import { useState, useEffect } from 'react';
import type { IFilme } from '../../models/filme.model';
import { filmeService } from '../../services/filme.service';
import './FilmesPages.css';

export function FilmesPages() {
  // ===== ESTADOS DO COMPONENTE =====
  const [filmes, setFilmes] = useState<IFilme[]>([]); // Armazena lista de filmes
  const [loading, setLoading] = useState(true); // Controla exibição do spinner de carregamento
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro
  const [filmeSelected, setFilmeSelected] = useState<IFilme | null>(null); // Filme selecionado para modal

  // ===== EFEITO COLATERAL - Executado na montagem do componente =====
  useEffect(() => {
    carregarFilmes(); // Carrega os filmes quando o componente monta
  }, []);

  // ===== FUNÇÃO: CARREGAR FILMES =====
  // Busca a lista de filmes da API
  const carregarFilmes = async () => {
    try {
      setLoading(true); // Ativa o spinner de carregamento
      const dados = await filmeService.listar(); // Chama serviço para buscar filmes
      setFilmes(dados); // Armazena os filmes no estado
      setError(null); // Limpa erros anteriores
    } catch (erro) {
      console.error('Erro ao carregar filmes:', erro);
      setError('Erro ao carregar filmes. Tente novamente mais tarde.');
    } finally {
      setLoading(false); // Desativa o spinner
    }
  };


  // ===== EXIBIÇÃO: SPINNER DE CARREGAMENTO =====
  // Mostra um spinner enquanto os dados estão sendo carregados
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

  // ===== EXIBIÇÃO: MENSAGEM DE ERRO =====
  // Mostra mensagem de erro se houver falha no carregamento
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // ===== FUNÇÃO: OBTER COR DO BADGE DE CLASSIFICAÇÃO =====
  // Retorna a classe CSS Bootstrap correspondente ao código de classificação
  // Exemplo: 'L' retorna 'bg-success' (verde)
  const getClassificacaoBadgeColor = (classificacao: string) => {
    const colors: Record<string, string> = {
      'L': 'bg-success', // Verde - Livre para todos
      '10': 'bg-info', // Azul - 10 anos
      '12': 'bg-warning text-dark', // Amarelo - 12 anos
      '14': 'badge-orange', // Laranja - 14 anos
      '16': 'bg-danger', // Vermelho - 16 anos
      '18': 'bg-dark text-light border border-light border-2', // Preto - 18 anos
    };
    return colors[classificacao] || 'bg-secondary';
  };

  // ===== FUNÇÃO: OBTER ESTILOS CUSTOMIZADOS DO BADGE =====
  // Retorna estilos inline para cores especiais (12 e 14 anos)
  const getClassificacaoBadgeStyle = (classificacao: string) => {
    if (classificacao === '12') {
      return { backgroundColor: '#FFE680', color: '#000' }; // Amarelo claro para 12 anos
    } else if (classificacao === '14') {
      return { backgroundColor: '#FF9800', color: '#fff' }; // Laranja para 14 anos
    }
    return {};
  };

  // ===== FUNÇÃO: OBTER ÍCONE EMOJI DA CLASSIFICAÇÃO =====
  // Retorna o emoji correspondente ao código de classificação
  // Exemplo: 'L' retorna '🟢' (círculo verde)
  const getClassificacaoIcon = (classificacao: string) => {
    const icons: Record<string, string> = {
      'L': '🟢', // Círculo verde
      '10': '🔵', // Círculo azul
      '12': '🟡', // Círculo amarelo
      '14': '🟠', // Círculo laranja
      '16': '🔴', // Círculo vermelho
      '18': '⚫', // Círculo preto
    };
    return icons[classificacao] || '❓';
  };

  return (
    <div className="filmes-page">
      {/* HERO SECTION - Cabeçalho com tema Pequi */}
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
        {/* Emojis decorativos */}
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
        {/* LEGENDA DE CLASSIFICAÇÕES - Mostra os códigos etários e suas cores */}
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

        {/* GRID DE FILMES - Layout responsivo com cards */}
        {filmes.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle"></i> Nenhum filme disponível no momento.
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">Total de {filmes.length} filme(s) em exibição</p>
            {/* Grid responsivo: mínimo 220px por coluna, máximo distribuído igualmente */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {/* MAP: Itera por cada filme e cria um card */}
              {filmes.map((filme) => (
                <div
                  key={filme.id}
                  // Ao clicar, abre modal com sinopse
                  onClick={() => setFilmeSelected(filme)}
                  style={{
                    // Fundo com textura Pequi (85% opacidade)
                    background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(/posters/Pequi fundos.jpg)',
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
                  // Efeito: Sobe e sombra aumenta ao passar mouse
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.25)';
                  }}
                  // Volta ao normal ao sair do mouse
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  {/* IMAGEM DO FILME - Proporção 2:3 (150% padding) */}
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#f0f0f0',
                      width: '100%',
                      height: '0',
                      paddingBottom: '150%' // Altura = 1.5x largura
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
                        objectFit: 'cover' // Recorta sem distorcer
                      }}
                      // Se imagem não carregar, usa placeholder
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                      }}
                    />
                  </div>
                  
                  {/* INFORMAÇÕES DO FILME */}
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Título */}
                    <h6 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '15px' }}>
                      {filme.titulo}
                    </h6>
                    {/* Gênero */}
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666' }}>
                      {filme.genero}
                    </p>
                    {/* Duração, Diretor e Badges (flex 1 = empurra para baixo) */}
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Duração */}
                      <small style={{ color: '#888' }}>
                        <i className="bi bi-clock"></i> {filme.duracao} min
                      </small>
                      {/* Diretor */}
                      <small style={{ color: '#666' }}>
                        <strong>Dir:</strong> {filme.diretor}
                      </small>
                      {/* Badges: Classificação + Rating */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                        {/* Badge Classificação Etária */}
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
                        {/* Badge Rating Rotten Tomatoes */}
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

      {/* MODAL - Exibe sinopse quando filme é clicado */}
      {filmeSelected && (
        // Overlay semi-transparente
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Escuro semi-transparente
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1050
        }} 
        // Fecha ao clicar no overlay
        onClick={() => setFilmeSelected(null)}>
          {/* Card do modal */}
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
          }} 
          // Previne fechar ao clicar dentro do modal
          onClick={(e) => e.stopPropagation()}>
            {/* Botão X para fechar */}
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

            {/* Título */}
            <h2 style={{ marginBottom: '15px', color: '#333', paddingRight: '40px' }}>
              {filmeSelected.titulo}
            </h2>

            {/* Badges: Classificação, Rating, Duração, Gênero */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {/* Badge Classificação */}
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
              {/* Badge Rating */}
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
              {/* Duração */}
              <span style={{ fontSize: '14px', color: '#666' }}>
                <i className="bi bi-clock"></i> {filmeSelected.duracao} min
              </span>
              {/* Gênero */}
              <span style={{ fontSize: '14px', color: '#666' }}>
                {filmeSelected.genero}
              </span>
            </div>

            {/* Detalhes: Diretor e Data */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                <strong>Diretor:</strong> {filmeSelected.diretor}
              </p>
              <p style={{ fontSize: '13px', color: '#888' }}>
                <strong>Lançamento:</strong> {new Date(filmeSelected.dataLancamento).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* SINOPSE */}
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

            {/* Botão Fechar */}
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
