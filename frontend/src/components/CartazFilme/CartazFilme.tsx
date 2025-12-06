// ===== IMPORTS =====
import type { IFilme } from '../../models/filme.model'; // Interface do modelo de filme
import { Link } from 'react-router-dom'; // Para navegação entre rotas

// ===== INTERFACE DO COMPONENTE =====
// Define as propriedades aceitas pelo componente CartazFilme
interface CartazFilmeProps {
  filme: IFilme; // Objeto do filme a ser exibido
  onClick?: () => void; // Callback opcional quando o cartaz é clicado
}

// ===== COMPONENTE CARTAZ FILME =====
// Exibe um cartaz (poster) do filme com informações e botão de compra
export function CartazFilme({ filme, onClick }: CartazFilmeProps) {
  // ===== FUNÇÃO: Retorna classe de cor Bootstrap baseada na classificação =====
  const getClassificacaoColor = (classificacao: string) => {
    const colors: Record<string, string> = {
      'L': 'bg-success',
      '10': 'bg-info',
      '12': 'bg-warning text-dark',
      '14': 'bg-danger',
      '16': 'bg-danger',
      '18': 'bg-dark text-light border border-light border-2',
    };
    return colors[classificacao] || 'bg-secondary';
  };

  const getClassificacaoLabel = (classificacao: string) => {
    const labels: Record<string, string> = {
      'L': 'L',
      '10': '10',
      '12': '12',
      '14': '14',
      '16': '16',
      '18': '18',
    };
    return labels[classificacao] || classificacao;
  };

  return (
    <div className="cartaz-filme" onClick={onClick}>
      <div className="poster-container">
        {/* Imagem do poster do filme com fallback */}
        <img 
          src={filme.poster} 
          alt={filme.titulo}
          className="poster-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
          }}
        />
        <div className={`classificacao-badge ${getClassificacaoColor(filme.classificacao)}`}>
          {getClassificacaoLabel(filme.classificacao)}
        </div>
        <div className="overlay-comprar">
          <Link to="/sessoes" className="btn btn-danger btn-lg">
            <i className="bi bi-ticket-perforated"></i> Comprar Ingressos
          </Link>
        </div>
      </div>
      
      <div className="filme-info">
        <h5 className="filme-titulo">{filme.titulo}</h5>
        <p className="filme-genero text-muted">{filme.genero}</p>
        <div className="filme-detalhes">
          <p className="filme-duracao small text-muted">
            <i className="bi bi-clock"></i> {filme.duracao} min
          </p>
          <p className="filme-diretor small">
            <strong>Dir.:</strong> {filme.diretor}
          </p>
        </div>
      </div>
    </div>
  );
}
