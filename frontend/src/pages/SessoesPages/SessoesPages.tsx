import { useState, useEffect } from 'react';
import type { ISessao } from '../../models/sessao.model';
import type { IFilme } from '../../models/filme.model';
import type { ISala } from '../../models/sala.model';
import { sessaoService } from '../../services/sessao.service';
import { filmeService } from '../../services/filme.service';
import { salaService } from '../../services/sala.service';
import ComprarIngressoModal from '../../components/ComprarIngressoModal/ComprarIngressoModal';

export function SessoesPages() {
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<Map<string, IFilme>>(new Map());
  const [salas, setSalas] = useState<Map<string, ISala>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<ISessao | undefined>();
  const [showCompraModal, setShowCompraModal] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [sessoesDados, filmesDados, salasDados] = await Promise.all([
        sessaoService.listar(),
        filmeService.listar(),
        salaService.listar(),
      ]);

      setSessoes(sessoesDados);
      
      const filmesMap = new Map<string, IFilme>();
      filmesDados.forEach((f) => {
        if (f.id) filmesMap.set(f.id, f);
      });
      setFilmes(filmesMap);

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

  const handleAbrirCompra = (sessao: ISessao) => {
    setSessaoSelecionada(sessao);
    setShowCompraModal(true);
  };

  const formatarHorario = (horario: string) => {
    return horario;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getClassificacaoColor = (classificacao: string) => {
    const colors: Record<string, string> = {
      'L': 'bg-success',
      '10': 'bg-info',
      '12': 'bg-warning text-dark',
      '14': 'bg-danger',
      '16': 'bg-dark',
      '18': 'bg-black text-danger',
    };
    return colors[classificacao] || 'bg-secondary';
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4">
            <i className="bi bi-calendar-event"></i> Sessões
          </h1>
          <p className="text-muted">Escolha uma sessão para comprar ingressos</p>
        </div>
      </div>

      {sessoes.length === 0 ? (
        <div className="alert alert-info">
          Nenhuma sessão disponível no momento.
        </div>
      ) : (
        <div className="row g-4">
          {sessoes.map((sessao) => {
            const filme = filmes.get(sessao.filmeId);
            const sala = salas.get(sessao.salaId);
            
            if (!filme || !sala) return null;

            return (
              <div key={sessao.id} className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-12 col-md-6">
                        <h5 className="card-title mb-2">
                          <span className={`badge ${getClassificacaoColor(filme.classificacao)} me-2`}>
                            {filme.classificacao}
                          </span>
                          {filme.titulo}
                        </h5>
                        <p className="card-text text-muted mb-1">
                          <strong>Gênero:</strong> {filme.genero}
                        </p>
                        <p className="card-text text-muted mb-1">
                          <strong>Duração:</strong> {filme.duracao} minutos
                        </p>
                        <p className="card-text text-muted">
                          <strong>Diretor:</strong> {filme.diretor}
                        </p>
                      </div>
                      
                      <div className="col-12 col-md-6">
                        <div className="row">
                          <div className="col-6 col-md-6">
                            <p className="mb-2">
                              <strong>Data:</strong> {formatarData(sessao.data)}
                            </p>
                            <p className="mb-2">
                              <strong>Horário:</strong> {formatarHorario(sessao.horario)}
                            </p>
                            <p className="mb-0">
                              <strong>Sala:</strong> {sala.numero} ({sala.tipo})
                            </p>
                          </div>
                          
                          <div className="col-6 col-md-6">
                            <p className="mb-2">
                              <strong>Preço:</strong> R$ {sessao.preco.toFixed(2)}
                            </p>
                            <p className="mb-2">
                              <strong>Assentos:</strong> {sessao.assentosDisponiveis} disponíveis
                            </p>
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

      <ComprarIngressoModal
        show={showCompraModal}
        sessao={sessaoSelecionada}
        filme={sessaoSelecionada ? filmes.get(sessaoSelecionada.filmeId) : undefined}
        sala={sessaoSelecionada ? salas.get(sessaoSelecionada.salaId) : undefined}
        onClose={() => setShowCompraModal(false)}
        onCompraSuccess={carregarDados}
      />
    </div>
  );
}
