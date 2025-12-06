// ============================================
// PÁGINA MINHAS COMPRAS - Cinema do Pequi Cerrado
// ============================================
// Exibe histórico de ingressos comprados pelo usuário
// Mostra detalhes de cada compra: filme, sala, horário, assento e data

import { useState, useEffect } from 'react';
import type { IIngresso } from '../../models/ingresso.model';
import type { ISessao } from '../../models/sessao.model';
import type { IFilme } from '../../models/filme.model';
import type { ISala } from '../../models/sala.model';

// Interface com detalhes completos de uma compra
interface CompraDetalhada {
  ingresso: IIngresso; // Dados do ingresso
  sessao?: ISessao;   // Dados da sessão
  filme?: IFilme;     // Dados do filme
  sala?: ISala;       // Dados da sala
}

// Interface com informações de uma sessão e seus ingressos
interface SessaoComDetalhes extends ISessao {
  filme?: IFilme;           // Filme da sessão
  sala?: ISala;             // Sala da sessão
  ingressos: IIngresso[];   // Lista de ingressos vendidos
}

// ===== FUNÇÃO: MINHAS COMPRAS PAGES =====
// Renderiza página com histórico de compras de ingressos
export function MinhasComprasPages() {
  // ===== ESTADOS =====
  const [compras, setCompras] = useState<CompraDetalhada[]>([]); // Histórico de compras
  const [loading, setLoading] = useState(true); // Indica se está carregando
  const [error, setError] = useState<string | null>(null); // Armazena erros
  const [showSessionsModal, setShowSessionsModal] = useState(false); // Controla modal
  const [sessoesCompradas, setSessoesCompradas] = useState<SessaoComDetalhes[]>([]); // Sessões compradas

  // ===== USEEFFECT: CARREGA COMPRAS AO MONTAR =====
  useEffect(() => {
    carregarCompras();
  }, []);

  // ===== FUNÇÃO: CARREGAR COMPRAS =====
  // Busca todos os ingressos e associa com sessões, filmes e salas
  const carregarCompras = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os ingressos
      const ingressosResponse = await fetch('http://localhost:4000/ingressos');
      const ingressos = await ingressosResponse.json();

      // Buscar sessões, filmes e salas para contexto
      const sessoesResponse = await fetch('http://localhost:4000/sessoes');
      const sessoes = await sessoesResponse.json();
      
      const filmesResponse = await fetch('http://localhost:4000/filmes');
      const filmes = await filmesResponse.json();
      
      const salasResponse = await fetch('http://localhost:4000/salas');
      const salas = await salasResponse.json();

      // Montar compras detalhadas - associa cada ingresso com sua sessão, filme e sala
      const comprasDetalhadas: CompraDetalhada[] = ingressos.map((ingresso: IIngresso) => {

        const sessao = sessoes.find((s: ISessao) => s.id === ingresso.sessaoId);
        const filme = sessao ? filmes.find((f: IFilme) => f.id === sessao.filmeId) : undefined;
        const sala = sessao ? salas.find((s: ISala) => s.id === sessao.salaId) : undefined;

        return { ingresso, sessao, filme, sala };
      });

      setCompras(comprasDetalhadas.sort((a, b) => 
        new Date(b.ingresso.dataCompra).getTime() - new Date(a.ingresso.dataCompra).getTime()
      ));
      setError(null);
    } catch (erro) {
      console.error('Erro ao carregar compras:', erro);
      setError('Erro ao carregar histórico de compras.');
    } finally {
      setLoading(false);
    }
  };

  const carregarSessoes = async () => {
    try {
      const filmesRes = await fetch('http://localhost:4000/filmes');
      const filmesData = await filmesRes.json();
      const filmesMap = new Map(filmesData.map((f: IFilme) => [f.id, f]));

      const salasRes = await fetch('http://localhost:4000/salas');
      const salasData = await salasRes.json();
      const salasMap = new Map(salasData.map((s: ISala) => [s.id, s]));

      const sessoesRes = await fetch('http://localhost:4000/sessoes');
      const sessoesData = await sessoesRes.json();

      const sessoesComDetalhes: SessaoComDetalhes[] = [];
      for (const sessao of sessoesData) {
        const ingressosRes = await fetch(`http://localhost:4000/ingressos?sessaoId=${sessao.id}`);
        const ingressosData = await ingressosRes.json();

        if (ingressosData.length > 0) {
          sessoesComDetalhes.push({
            ...sessao,
            filme: filmesMap.get(sessao.filmeId),
            sala: salasMap.get(sessao.salaId),
            ingressos: ingressosData,
          });
        }
      }

      sessoesComDetalhes.sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.horario}`);
        const dataB = new Date(`${b.data}T${b.horario}`);
        return dataB.getTime() - dataA.getTime();
      });

      setSessoesCompradas(sessoesComDetalhes);
      setShowSessionsModal(true);
    } catch (erro) {
      console.error('Erro ao carregar sessões:', erro);
    }
  };

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

  return (
    <div className="container mt-5 mb-5">
      <div className="row mb-4 align-items-center">
        <div className="col-12 col-md-6">
          <h1 className="display-4">
            <i className="bi bi-ticket-perforated"></i> Minhas Compras
          </h1>
          <p className="text-muted">Histórico de ingressos comprados</p>
        </div>
        <div className="col-12 col-md-6 text-end">
          <button 
            className="btn btn-primary btn-lg"
            onClick={carregarSessoes}
          >
            <i className="bi bi-calendar-check"></i> Ver Minhas Sessões
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {compras.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle"></i> Você ainda não comprou ingressos. 
          <a href="/sessoes" className="alert-link ms-2">Compre um ingresso agora</a>
        </div>
      ) : (
        <div className="row g-3">
          {compras.map((compra) => (
            <div key={compra.ingresso.id} className="col-12">
              <div className="card border-left-5" style={{borderLeft: '5px solid #007bff'}}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <h5 className="card-title mb-3">
                        {compra.filme?.titulo || 'Filme não encontrado'}
                      </h5>
                      
                      <div className="row g-3 small text-muted">
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Data da Compra:</strong><br />
                            {new Date(compra.ingresso.dataCompra).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="mb-0">
                            <strong>Assento:</strong><br />
                            {compra.ingresso.assento}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Sala:</strong><br />
                            {compra.sala?.numero || '-'} ({compra.sala?.tipo || '-'})
                          </p>
                          <p className="mb-0">
                            <strong>Data/Hora da Sessão:</strong><br />
                            {compra.sessao?.data} às {compra.sessao?.horario}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 d-flex flex-column justify-content-center align-items-end">
                      <div className="text-end">
                        <h6 className="mb-2">
                          <span className="badge bg-success">
                            {compra.ingresso.status === 'vendido' ? 'Comprado' : compra.ingresso.status}
                          </span>
                        </h6>
                        <p className="mb-0 fs-5">
                          <strong>R$ {compra.ingresso.preco.toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Minhas Sessões */}
      {showSessionsModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-calendar-check"></i> Minhas Sessões
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSessionsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {sessoesCompradas.length === 0 ? (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle"></i> Você ainda não comprou nenhum ingresso.
                  </div>
                ) : (
                  <div className="row g-3">
                    {sessoesCompradas.map((sessao) => (
                      <div key={`sessao-${sessao.id}`} className="col-12">
                        <div className="card shadow-sm border-0">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-8">
                                <h6 className="card-title mb-2">
                                  <i className="bi bi-film"></i> {sessao.filme?.titulo}
                                </h6>

                                <div className="small text-muted">
                                  <p className="mb-1">
                                    <strong>Data:</strong> {new Date(sessao.data).toLocaleDateString('pt-BR')}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Horário:</strong> {sessao.horario}
                                  </p>
                                  <p className="mb-0">
                                    <strong>Sala:</strong> {sessao.sala?.numero} ({sessao.sala?.tipo})
                                  </p>
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="bg-light p-2 rounded">
                                  <p className="small mb-2"><strong>Assentos:</strong></p>
                                  <div className="d-flex flex-wrap gap-1">
                                    {sessao.ingressos
                                      .sort((a, b) => a.assento.localeCompare(b.assento))
                                      .map((ingresso) => (
                                        <span
                                          key={ingresso.id}
                                          className="badge bg-primary"
                                          style={{ fontSize: '11px', padding: '4px 8px' }}
                                        >
                                          {ingresso.assento}
                                        </span>
                                      ))}
                                  </div>
                                  <p className="small mt-2 mb-0">
                                    <strong>Total:</strong> R$ {(sessao.preco * sessao.ingressos.length).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSessionsModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
