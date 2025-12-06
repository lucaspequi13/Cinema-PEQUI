import { useState, useEffect } from 'react';
import type { IFilme } from '../../models/filme.model';
import type { ISala } from '../../models/sala.model';
import type { ISessao } from '../../models/sessao.model';
import { filmeService } from '../../services/filme.service';
import { salaService } from '../../services/sala.service';
import { sessaoService } from '../../services/sessao.service';
import { FormFilme } from '../../components/FormFilme/FormFilme';
import { FormSessao } from '../../components/FormSessao/FormSessao';
import { FormSala } from '../../components/FormSala/FormSala';

export function AdminPages() {
  const [activeTab, setActiveTab] = useState<'filmes' | 'salas' | 'sessoes'>('filmes');
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessaoEditando, setSessaoEditando] = useState<ISessao | null>(null);
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const [filmeEditando, setFilmeEditando] = useState<IFilme | null>(null);
  const [showModalEdicaoFilme, setShowModalEdicaoFilme] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const obterTituloFilme = (filmeId: string): string => {
    const filme = filmes.find(f => f.id === filmeId);
    return filme?.titulo || filmeId;
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      if (activeTab === 'filmes') {
        const dados = await filmeService.listar();
        console.log('Filmes carregados:', dados);
        setFilmes(dados);
      } else if (activeTab === 'salas') {
        const dados = await salaService.listar();
        console.log('Salas carregadas:', dados);
        setSalas(dados);
      } else if (activeTab === 'sessoes') {
        const dados = await sessaoService.listar();
        console.log('Sessões carregadas:', dados);
        setSessoes(dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFilme = async (id?: string) => {
    if (!id) return;
    if (confirm('Tem certeza que deseja deletar este filme?')) {
      try {
        await filmeService.deletar(id);
        setFilmes(filmes.filter(f => f.id !== id));
      } catch (erro) {
        console.error('Erro ao deletar filme:', erro);
        alert('Erro ao deletar filme');
      }
    }
  };

  const handleDeleteSala = async (id?: string) => {
    if (!id) return;
    if (confirm('Tem certeza que deseja deletar esta sala?')) {
      try {
        await salaService.deletar(id);
        setSalas(salas.filter(s => s.id !== id));
      } catch (erro) {
        console.error('Erro ao deletar sala:', erro);
        alert('Erro ao deletar sala');
      }
    }
  };


  // ===== FUNÇÃO: DELETAR SESSÃO =====
  // Remove uma sessão da lista e da API
  const handleDeleteSessao = async (id?: string) => {
    if (!id) return;
    if (confirm('Tem certeza que deseja deletar esta sessão?')) {
      try {
        await sessaoService.deletar(id); // API request para deletar
        setSessoes(sessoes.filter(s => s.id !== id)); // Remove da lista local
      } catch (erro) {
        console.error('Erro ao deletar sessão:', erro);
        alert('Erro ao deletar sessão');
      }
    }
  };

  // ===== FUNÇÃO: EDITAR SESSÃO =====
  // Abre modal para editar uma sessão existente
  const handleEditarSessao = (sessao: ISessao) => {
    setSessaoEditando(sessao);
    setShowModalEdicao(true);
  };

  // ===== FUNÇÃO: SALVAR EDIÇÃO DE SESSÃO =====
  // Envia alterações da sessão para a API e atualiza a lista local
  const handleSalvarEdicao = async () => {
    if (!sessaoEditando || !sessaoEditando.id) return;
    try {
      await sessaoService.atualizar(sessaoEditando.id, sessaoEditando);
      setSessoes(sessoes.map(s => s.id === sessaoEditando.id ? sessaoEditando : s));
      setShowModalEdicao(false);
      setSessaoEditando(null);
      alert('Sessão atualizada com sucesso!');
    } catch (erro) {
      console.error('Erro ao atualizar sessão:', erro);
      alert('Erro ao atualizar sessão');
    }
  };

  // ===== FUNÇÃO: EDITAR FILME =====
  // Abre modal para editar um filme existente
  const handleEditarFilme = (filme: IFilme) => {
    setFilmeEditando(filme);
    setShowModalEdicaoFilme(true);
  };

  // ===== FUNÇÃO: SALVAR EDIÇÃO DE FILME =====
  // Envia alterações do filme para a API e atualiza a lista local
  const handleSalvarEdicaoFilme = async () => {
    if (!filmeEditando || !filmeEditando.id) return;
    try {
      await filmeService.atualizar(filmeEditando.id, filmeEditando);
      setFilmes(filmes.map(f => f.id === filmeEditando.id ? filmeEditando : f));
      setShowModalEdicaoFilme(false);
      setFilmeEditando(null);
      alert('Filme atualizado com sucesso!');
    } catch (erro) {
      console.error('Erro ao atualizar filme:', erro);
      alert('Erro ao atualizar filme');
    }
  };

  // ===== RETORNO: JSX PRINCIPAL =====
  return (
    <div className="container mt-5 mb-5">
      {/* CABEÇALHO - Título e descrição do painel */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4">
            <i className="bi bi-sliders"></i> Painel Administrativo
          </h1>
          <p className="text-muted">Gerencie filmes, salas e sessões do Cinema do Pequi Cerrado</p>
        </div>
      </div>

      {/* ABAS/TABS - Três abas: Filmes, Salas e Sessões */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        {/* ABA 1: Filmes */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'filmes' ? 'active' : ''}`}
            id="filmes-tab"
            onClick={() => setActiveTab('filmes')}
            type="button"
          >
            <i className="bi bi-film"></i> Filmes
          </button>
        </li>

        {/* ABA 2: Salas */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'salas' ? 'active' : ''}`}
            id="salas-tab"
            onClick={() => setActiveTab('salas')}
            type="button"
          >
            <i className="bi bi-door-closed"></i> Salas
          </button>
        </li>

        {/* ABA 3: Sessões */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'sessoes' ? 'active' : ''}`}
            id="sessoes-tab"
            onClick={() => setActiveTab('sessoes')}
            type="button"
          >
            <i className="bi bi-calendar-event"></i> Sessões
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'filmes' && (
          <div>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <FormFilme onSuccess={carregarDados} />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border"></div>
              </div>
            ) : filmes.length === 0 ? (
              <div className="alert alert-info mt-4">Nenhum filme cadastrado</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '24px',
                marginTop: '30px',
                maxWidth: '1400px',
                margin: '30px auto 0'
              }}>
                {filmes.map(filme => (
                  <div
                    key={filme.id}
                    style={{
                      background: 'linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url(/posters/Pequi fundos.jpg)',
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
                      </div>
                    </div>

                    <div style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-sm btn-warning flex-grow-1"
                        onClick={() => handleEditarFilme(filme)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleDeleteFilme(filme.id)}
                        title="Deletar"
                      >
                        <i className="bi bi-trash"></i> Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'salas' && (
          <div className="row">
            <div className="col-lg-6 mb-4">
              <FormSala onSuccess={carregarDados} />
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-list"></i> Salas Cadastradas
                  </h5>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border"></div>
                    </div>
                  ) : salas.length === 0 ? (
                    <p className="text-muted text-center">Nenhuma sala cadastrada</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Sala</th>
                            <th>Tipo</th>
                            <th>Capacidade</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salas.map(sala => (
                            <tr key={sala.id}>
                              <td>{sala.numero}</td>
                              <td>{sala.tipo}</td>
                              <td>{sala.capacidade}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteSala(sala.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessoes' && (
          <div className="row">
            <div className="col-lg-6 mb-4">
              <FormSessao onSuccess={carregarDados} />
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-list"></i> Sessões Cadastradas
                  </h5>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border"></div>
                    </div>
                  ) : sessoes.length === 0 ? (
                    <p className="text-muted text-center">Nenhuma sessão cadastrada</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead className="table-dark">
                          <tr>
                            <th>Filme</th>
                            <th>Sala</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Preço</th>
                            <th>Assentos</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessoes.map(sessao => {
                            const sala = salas.find(s => s.id === sessao.salaId);
                            return (
                              <tr key={sessao.id}>
                                <td>
                                  <strong>{obterTituloFilme(sessao.filmeId)}</strong>
                                </td>
                                <td>{sala ? `Sala ${sala.numero} (${sala.tipo})` : 'Sala desconhecida'}</td>
                                <td>{new Date(sessao.data).toLocaleDateString('pt-BR')}</td>
                                <td>{sessao.horario}</td>
                                <td>R$ {sessao.preco.toFixed(2)}</td>
                                <td>
                                  <span className="badge bg-info">{sessao.assentosDisponiveis}</span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleEditarSessao(sessao)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteSessao(sessao.id)}
                                    title="Deletar"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edição de Sessão */}
      {showModalEdicao && sessaoEditando && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Sessão</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalEdicao(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Filme</label>
                  <select
                    className="form-control"
                    value={sessaoEditando.filmeId}
                    onChange={(e) =>
                      setSessaoEditando({
                        ...sessaoEditando,
                        filmeId: e.target.value,
                      })
                    }
                  >
                    {filmes.map((filme) => (
                      <option key={filme.id} value={filme.id}>
                        {filme.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Sala</label>
                  <select
                    className="form-control"
                    value={sessaoEditando.salaId}
                    onChange={(e) =>
                      setSessaoEditando({
                        ...sessaoEditando,
                        salaId: e.target.value,
                      })
                    }
                  >
                    {salas.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        Sala {sala.numero} - {sala.tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      className="form-control"
                      value={sessaoEditando.data}
                      onChange={(e) =>
                        setSessaoEditando({
                          ...sessaoEditando,
                          data: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Horário</label>
                    <input
                      type="time"
                      className="form-control"
                      value={sessaoEditando.horario}
                      onChange={(e) =>
                        setSessaoEditando({
                          ...sessaoEditando,
                          horario: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={sessaoEditando.preco}
                    onChange={(e) =>
                      setSessaoEditando({
                        ...sessaoEditando,
                        preco: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Assentos Disponíveis</label>
                  <input
                    type="number"
                    className="form-control"
                    value={sessaoEditando.assentosDisponiveis}
                    onChange={(e) =>
                      setSessaoEditando({
                        ...sessaoEditando,
                        assentosDisponiveis: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModalEdicao(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSalvarEdicao}
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Filme */}
      {showModalEdicaoFilme && filmeEditando && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Filme</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalEdicaoFilme(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Título *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filmeEditando.titulo}
                      onChange={(e) =>
                        setFilmeEditando({ ...filmeEditando, titulo: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Diretor *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filmeEditando.diretor}
                      onChange={(e) =>
                        setFilmeEditando({ ...filmeEditando, diretor: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={filmeEditando.descricao}
                    onChange={(e) =>
                      setFilmeEditando({ ...filmeEditando, descricao: e.target.value })
                    }
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gênero *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filmeEditando.genero}
                      onChange={(e) =>
                        setFilmeEditando({ ...filmeEditando, genero: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Classificação *</label>
                    <select
                      className="form-control"
                      value={filmeEditando.classificacao}
                      onChange={(e) =>
                        setFilmeEditando({
                          ...filmeEditando,
                          classificacao: e.target.value as any,
                        })
                      }
                    >
                      <option value="L">L - Livre</option>
                      <option value="10">10 anos</option>
                      <option value="12">12 anos</option>
                      <option value="14">14 anos</option>
                      <option value="16">16 anos</option>
                      <option value="18">18 anos</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duração (minutos) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={filmeEditando.duracao}
                      onChange={(e) =>
                        setFilmeEditando({ ...filmeEditando, duracao: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data de Lançamento *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filmeEditando.dataLancamento}
                      onChange={(e) =>
                        setFilmeEditando({ ...filmeEditando, dataLancamento: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">URL do Poster *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filmeEditando.poster}
                    onChange={(e) =>
                      setFilmeEditando({ ...filmeEditando, poster: e.target.value })
                    }
                  />
                  {filmeEditando.poster && (
                    <div className="mt-3">
                      <p className="text-muted small">Preview:</p>
                      <img
                        src={filmeEditando.poster}
                        alt="Poster"
                        style={{
                          maxWidth: '120px',
                          maxHeight: '160px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          padding: '4px',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModalEdicaoFilme(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSalvarEdicaoFilme}
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
