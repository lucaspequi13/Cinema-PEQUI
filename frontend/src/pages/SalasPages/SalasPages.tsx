import { useState, useEffect } from 'react';
import type { ISala } from '../../models/sala.model';
import { salaService } from '../../services/sala.service';
import { SeatMap } from '../../components/SeatMap/SeatMap';

export function SalasPages() {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salaSelecionada, setSalaSelecionada] = useState<ISala | null>(null);
  const [assentosOcupadosSala, setAssentosOcupadosSala] = useState<string[]>([]);

  useEffect(() => {
    carregarSalas();
  }, []);

  const carregarSalas = async () => {
    try {
      setLoading(true);
      const dados = await salaService.listar();
      setSalas(dados);
      setError(null);
    } catch (erro) {
      console.error('Erro ao carregar salas:', erro);
      setError('Erro ao carregar salas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getTipoSalaBadge = (tipo: string) => {
    const badges: Record<string, string> = {
      'padrão': 'bg-primary',
      '3D': 'bg-info',
      'IMAX': 'bg-warning text-dark',
      '4DX': 'bg-danger',
    };
    return badges[tipo] || 'bg-secondary';
  };

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
            <i className="bi bi-door-closed"></i> Salas do Cinema do Pequi Cerrado
          </h1>
          <p className="text-muted">Conheça nossas salas disponíveis</p>
        </div>
      </div>

      {salas.length === 0 ? (
        <div className="alert alert-info">
          Nenhuma sala disponível no momento.
        </div>
      ) : (
        <div className="row g-4">
          {salas.map((sala) => (
            <div key={sala.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-door-closed"></i> Sala {sala.numero}
                  </h5>
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
                  <div className="mb-3">
                    <p className="card-text">
                      <strong>Capacidade:</strong> {sala.capacidade} lugares
                    </p>
                    <p className="card-text">
                      <strong>Disponíveis:</strong> {sala.capacidade - sala.assentosOcupados}
                    </p>
                    {sala.vip && sala.temperaturAC && (
                      <p className="card-text">
                        <strong><i className="bi bi-snow"></i> A/C:</strong> {sala.temperaturAC}°C
                      </p>
                    )}
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

      {salaSelecionada && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Sala {salaSelecionada.numero} - {salaSelecionada.tipo.toUpperCase()}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSalaSelecionada(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Capacidade:</strong> {salaSelecionada.capacidade} lugares</p>
                      <p className="mb-1"><strong>Ocupados:</strong> {salaSelecionada.assentosOcupados}</p>
                      <p className="mb-0"><strong>Disponíveis:</strong> {salaSelecionada.capacidade - salaSelecionada.assentosOcupados}</p>
                    </div>
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
                <SeatMap
                  capacidade={salaSelecionada.capacidade}
                  assentosOcupados={assentosOcupadosSala}
                  assentosComprados={[]}
                  onSelectSeat={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
