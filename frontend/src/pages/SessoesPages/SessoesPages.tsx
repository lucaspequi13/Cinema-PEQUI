// ============================================
// PÁGINA SESSÕES - Cinema do Pequi Cerrado
// ============================================
// Exibe todas as sessões de filmes disponíveis
// Permite compra de ingressos para cada sessão
// Mostra informações: data, horário, sala, filme, preço

import { useState, useEffect } from 'react';
import type { ISessao } from '../../models/sessao.model';
import type { IFilme } from '../../models/filme.model';
import type { ISala } from '../../models/sala.model';
import { sessaoService } from '../../services/sessao.service';
import { filmeService } from '../../services/filme.service';
import { salaService } from '../../services/sala.service';
import ComprarIngressoModal from '../../components/ComprarIngressoModal/ComprarIngressoModal';

// ===== FUNÇÃO: SESSÕES PAGES =====
// Renderiza a página com lista de sessões de filmes
export function SessoesPages() {
  // ===== ESTADOS =====
  const [sessoes, setSessoes] = useState<ISessao[]>([]); // Lista de sessões
  const [filmes, setFilmes] = useState<Map<string, IFilme>>(new Map()); // Mapa de filmes por ID (para rápido acesso)
  const [salas, setSalas] = useState<Map<string, ISala>>(new Map()); // Mapa de salas por ID (para rápido acesso)
  const [loading, setLoading] = useState(true); // Indica se está carregando
  const [error, setError] = useState<string | null>(null); // Armazena erros
  const [sessaoSelecionada, setSessaoSelecionada] = useState<ISessao | undefined>(); // Sessão selecionada para compra
  const [showCompraModal, setShowCompraModal] = useState(false); // Controla abertura do modal de compra

  // ===== USEEFFECT: CARREGA DADOS AO MONTAR =====
  // Executa carregarDados quando componente é montado
  useEffect(() => {
    carregarDados();
  }, []);

  // ===== FUNÇÃO: CARREGAR DADOS =====
  // Busca sessões, filmes e salas do backend em paralelo (Promise.all)
  // Armazena filmes e salas em Maps para acesso rápido por ID
  const carregarDados = async () => {
    try {
      setLoading(true);
      // Busca paralela de 3 endpoints
      const [sessoesDados, filmesDados, salasDados] = await Promise.all([
        sessaoService.listar(),
        filmeService.listar(),
        salaService.listar(),
      ]);

      setSessoes(sessoesDados);
      
      // Converte array de filmes em Map {id => filme}
      const filmesMap = new Map<string, IFilme>();
      filmesDados.forEach((f) => {
        if (f.id) filmesMap.set(f.id, f);
      });
      setFilmes(filmesMap);

      // Converte array de salas em Map {id => sala}
      const salasMap = new Map<string, ISala>();
      salasDados.forEach((s) => {
        if (s.id) salasMap.set(s.id, s);
      });
      setSalas(salasMap);

      setError(null);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      setError('Erro ao carregar sessões. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNÇÃO: ABRIR MODAL DE COMPRA =====
  // Abre modal e seleciona sessão para compra de ingressos
  const handleAbrirCompra = (sessao: ISessao) => {
    setSessaoSelecionada(sessao);
    setShowCompraModal(true);
  };

  // ===== FUNÇÃO: FORMATAR HORÁRIO =====
  // Formata string de horário (atualmente apenas retorna como está)
  const formatarHorario = (horario: string) => {
    return horario;
  };

  // ===== FUNÇÃO: FORMATAR DATA =====
  // Converte data para formato brasileiro (DD/MM/YYYY)
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // ===== FUNÇÃO: GET CLASSIFICAÇÃO COLOR =====
  // Retorna classe Bootstrap de cor conforme a classificação etária
  // L=verde, 10=ciano, 12=amarelo, 14=vermelho, 16=preto, 18=preto+vermelho
  const getClassificacaoColor = (classificacao: string) => {
    const colors: Record<string, string> = {
      'L': 'bg-success',        // Livre - verde
      '10': 'bg-info',          // 10 anos - ciano
      '12': 'bg-warning text-dark', // 12 anos - amarelo
      '14': 'bg-danger',        // 14 anos - vermelho
      '16': 'bg-dark',          // 16 anos - preto
      '18': 'bg-black text-danger', // 18 anos - preto+vermelho
    };
    return colors[classificacao] || 'bg-secondary';
  };

  // ===== CONDIÇÃO: ESTADO CARREGANDO =====
  // Mostra spinner enquanto dados estão sendo carregados
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  // ===== CONDIÇÃO: ESTADO ERRO =====
  // Mostra mensagem de erro se houver falha
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // ===== RETORNO: JSX PRINCIPAL =====
  return (
    <div className="container mt-5 mb-5">
      {/* CABEÇALHO - Título da página */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4">
            <i className="bi bi-calendar-event"></i> Sessões
          </h1>
          <p className="text-muted">Escolha uma sessão para comprar ingressos</p>
        </div>
      </div>

      {/* CONDIÇÃO: LISTA VAZIA */}
      {sessoes.length === 0 ? (
        <div className="alert alert-info">
          Nenhuma sessão disponível no momento.
        </div>
      ) : (
        // GRID DE SESSÕES - Cada sessão é um card com detalhes
        <div className="row g-4">
          {/* MAPEAMENTO - Itera sobre todas as sessões */}
          {sessoes.map((sessao) => {
            // Busca filme e sala usando Map para acesso rápido
            const filme = filmes.get(sessao.filmeId);
            const sala = salas.get(sessao.salaId);
            
            // Se filme ou sala não existir, não renderiza
            if (!filme || !sala) return null;

            return (
              <div key={sessao.id} className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* COLUNA 1: Informações do filme */}
                      <div className="col-12 col-md-6">
                        {/* TÍTULO: Classificação + nome do filme */}
                        <h5 className="card-title mb-2">
                          <span className={`badge ${getClassificacaoColor(filme.classificacao)} me-2`}>
                            {filme.classificacao}
                          </span>
                          {filme.titulo}
                        </h5>
                        {/* GÊNERO */}
                        <p className="card-text text-muted mb-1">
                          <strong>Gênero:</strong> {filme.genero}
                        </p>
                        {/* DURAÇÃO */}
                        <p className="card-text text-muted mb-1">
                          <strong>Duração:</strong> {filme.duracao} minutos
                        </p>
                        {/* DIRETOR */}
                        <p className="card-text text-muted">
                          <strong>Diretor:</strong> {filme.diretor}
                        </p>
                      </div>
                      
                      {/* COLUNA 2: Informações da sessão (data, hora, sala, preço) */}
                      <div className="col-12 col-md-6">
                        <div className="row">
                          {/* SUBCOLUNA 1: Data, hora, sala */}
                          <div className="col-6 col-md-6">
                            {/* DATA DA SESSÃO */}
                            <p className="mb-2">
                              <strong>Data:</strong> {formatarData(sessao.data)}
                            </p>
                            {/* HORÁRIO DA SESSÃO */}
                            <p className="mb-2">
                              <strong>Horário:</strong> {formatarHorario(sessao.horario)}
                            </p>
                            {/* SALA */}
                            <p className="mb-0">
                              <strong>Sala:</strong> {sala.numero} ({sala.tipo})
                            </p>
                          </div>
                          
                          {/* SUBCOLUNA 2: Preço, assentos disponíveis e botão */}
                          <div className="col-6 col-md-6">
                            {/* PREÇO */}
                            <p className="mb-2">
                              <strong>Preço:</strong> R$ {sessao.preco.toFixed(2)}
                            </p>
                            {/* ASSENTOS DISPONÍVEIS */}
                            <p className="mb-2">
                              <strong>Assentos:</strong> {sessao.assentosDisponiveis} disponíveis
                            </p>
                            {/* BOTÃO COMPRAR - Desabilitado se sessão lotada */}
                            <button 
                              className="btn btn-primary btn-sm w-100"
                              onClick={() => handleAbrirCompra(sessao)}
                              disabled={sessao.assentosDisponiveis === 0}
                            >
                              {sessao.assentosDisponiveis === 0 ? 'Sessão Lotada' : 'Comprar Ingresso'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE COMPRA - Abre quando botão "Comprar Ingresso" é clicado */}
      <ComprarIngressoModal
        show={showCompraModal} // Props que controla visibilidade
        sessao={sessaoSelecionada} // Sessão selecionada
        filme={sessaoSelecionada ? filmes.get(sessaoSelecionada.filmeId) : undefined} // Filme da sessão
        sala={sessaoSelecionada ? salas.get(sessaoSelecionada.salaId) : undefined} // Sala da sessão
        onClose={() => setShowCompraModal(false)} // Função para fechar modal
        onCompraSuccess={carregarDados} // Função para recarregar dados após compra bem-sucedida
      />
    </div>
  );
}
