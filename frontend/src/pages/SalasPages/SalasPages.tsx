// ============================================
// PÁGINA SALAS - Cinema do Pequi Cerrado
// ============================================
// Exibe todas as salas do cinema com informações de capacidade,
// tipo (Padrão, 3D, IMAX, 4DX), status VIP e disponibilidade
// Permite visualizar o mapa de assentos de cada sala

import { useState, useEffect } from 'react';
import type { ISala } from '../../models/sala.model';
import { salaService } from '../../services/sala.service';
import { SeatMap } from '../../components/SeatMap/SeatMap';

// ===== FUNÇÃO: SALAS PAGES =====
// Renderiza a página com lista de salas e visualização de assentos
export function SalasPages() {
  // ===== ESTADOS =====
  const [salas, setSalas] = useState<ISala[]>([]); // Lista de todas as salas
  const [loading, setLoading] = useState(true); // Indica se está carregando dados
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro
  const [salaSelecionada, setSalaSelecionada] = useState<ISala | null>(null); // Sala selecionada para ver detalhes
  const [assentosOcupadosSala, setAssentosOcupadosSala] = useState<string[]>([]); // Assentos ocupados na sala

  // ===== USEEFFECT: CARREGA SALAS AO MONTAR =====
  // Executa a função carregarSalas quando o componente é montado
  useEffect(() => {
    carregarSalas();
  }, []);

  // ===== FUNÇÃO: CARREGAR SALAS =====
  // Busca todas as salas do backend via API
  const carregarSalas = async () => {
    try {
      setLoading(true);
      const dados = await salaService.listar(); // Chamada à API
      setSalas(dados);
      setError(null);
    } catch (erro) {
      console.error('Erro ao carregar salas:', erro);
      setError('Erro ao carregar salas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNÇÃO: GET TIPO SALA BADGE =====
  // Retorna a classe Bootstrap de cor para diferentes tipos de sala
  // Padrão=azul, 3D=ciano, IMAX=amarelo, 4DX=vermelho
  const getTipoSalaBadge = (tipo: string) => {
    const badges: Record<string, string> = {
      'padrão': 'bg-primary',       // Azul
      '3D': 'bg-info',              // Ciano
      'IMAX': 'bg-warning text-dark', // Amarelo
      '4DX': 'bg-danger',           // Vermelho
    };
    return badges[tipo] || 'bg-secondary';
  };

  // ===== FUNÇÃO: CARREGAR ASSENTOS OCUPADOS =====
  // Busca todos os assentos ocupados da sala em todas as sessões
  // Faz chamadas sequenciais para: sessões -> ingressos
  const carregarAssentosOcupados = async (salaId: string) => {
    try {
      // Buscar todas as sessões dessa sala
      const sessoesResponse = await fetch(`http://localhost:4000/sessoes?salaId=${salaId}`);
      const sessoes = await sessoesResponse.json();
      
      // Buscar todos os ingressos dessas sessões
      let assentosOcupados: string[] = [];
      for (const sessao of sessoes) {
        const ingressosResponse = await fetch(`http://localhost:4000/ingressos?sessaoId=${sessao.id}`);
        const ingressos = await ingressosResponse.json();
        assentosOcupados = [...assentosOcupados, ...ingressos.map((i: any) => i.assento)];
      }
      
      setAssentosOcupadosSala(assentosOcupados);
    } catch (erro) {
      console.error('Erro ao carregar assentos:', erro);
      setAssentosOcupadosSala([]);
    }
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
  // Mostra mensagem de erro se houver falha ao carregar
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
      {/* CABEÇALHO - Título e descrição da página */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4">
            <i className="bi bi-door-closed"></i> Salas do Cinema do Pequi Cerrado
          </h1>
          <p className="text-muted">Conheça nossas salas disponíveis</p>
        </div>
      </div>

      {/* CONDIÇÃO: LISTA VAZIA */}
      {salas.length === 0 ? (
        <div className="alert alert-info">
          Nenhuma sala disponível no momento.
        </div>
      ) : (
        // GRID DE SALAS - Mostra todas as salas em cards
        <div className="row g-4">
          {/* MAPEAMENTO - Cada sala é um card */}
          {salas.map((sala) => (
            <div key={sala.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  {/* TÍTULO: Número da sala com ícone */}
                  <h5 className="card-title">
                    <i className="bi bi-door-closed"></i> Sala {sala.numero}
                  </h5>

                  {/* BADGES: Tipo de sala (3D, IMAX, etc) e status VIP */}
                  <div className="mb-3">
                    <span className={`badge ${getTipoSalaBadge(sala.tipo)}`}>
                      {sala.tipo.toUpperCase()}
                    </span>
                    {sala.vip && (
                      <span className="badge bg-warning text-dark ms-2">
                        <i className="bi bi-star-fill"></i> VIP
                      </span>
                    )}
                  </div>

                  {/* INFORMAÇÕES: Capacidade, disponibilidade, temperatura */}
                  <div className="mb-3">
                    <p className="card-text">
                      <strong>Capacidade:</strong> {sala.capacidade} lugares
                    </p>
                    <p className="card-text">
                      <strong>Disponíveis:</strong> {sala.capacidade - sala.assentosOcupados}
                    </p>
                    {/* Temperatura só aparece em salas VIP */}
                    {sala.vip && sala.temperaturAC && (
                      <p className="card-text">
                        <strong><i className="bi bi-snow"></i> A/C:</strong> {sala.temperaturAC}°C
                      </p>
                    )}

                    {/* PROGRESS BAR: Mostra percentual de assentos disponíveis */}
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${((sala.capacidade - sala.assentosOcupados) / sala.capacidade) * 100}%`
                        }}
                      >
                        {Math.round(((sala.capacidade - sala.assentosOcupados) / sala.capacidade) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* BOTÃO: Ver assentos - abre modal com mapa de assentos */}
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => {
                      setSalaSelecionada(sala);
                      carregarAssentosOcupados(sala.id!);
                    }}
                  >
                    <i className="bi bi-eye"></i> Ver Assentos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Detalhes da sala com mapa de assentos */}
      {salaSelecionada && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* CABEÇALHO DO MODAL - Número e tipo de sala */}
              <div className="modal-header">
                <h5 className="modal-title">
                  Sala {salaSelecionada.numero} - {salaSelecionada.tipo.toUpperCase()}
                </h5>
                {/* BOTÃO FECHAR - Fecha modal ao clicar */}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSalaSelecionada(null)}
                ></button>
              </div>

              {/* CORPO DO MODAL - Informações e mapa de assentos */}
              <div className="modal-body">
                {/* INFORMAÇÕES RESUMIDAS - Capacidade, ocupação, etc */}
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Capacidade:</strong> {salaSelecionada.capacidade} lugares</p>
                      <p className="mb-1"><strong>Ocupados:</strong> {salaSelecionada.assentosOcupados}</p>
                      <p className="mb-0"><strong>Disponíveis:</strong> {salaSelecionada.capacidade - salaSelecionada.assentosOcupados}</p>
                    </div>
                    {/* Dados VIP - Mostra apenas se sala é VIP */}
                    <div className="col-md-6">
                      {salaSelecionada.vip && (
                        <>
                          <p className="mb-1"><span className="badge bg-warning text-dark"><i className="bi bi-star-fill"></i> Sala VIP</span></p>
                          {salaSelecionada.temperaturAC && (
                            <p className="mb-0"><strong><i className="bi bi-snow"></i> A/C:</strong> {salaSelecionada.temperaturAC}°C</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* MAPA DE ASSENTOS - Visualização dos assentos ocupados/disponíveis */}
                <SeatMap
                  capacidade={salaSelecionada.capacidade}
                  assentosOcupados={assentosOcupadosSala}
                  assentosComprados={[]}
                  onSelectSeat={() => {}} // Função vazia pois é apenas visualização
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
