import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SeatMap } from '../SeatMap/SeatMap';
import type { IFilme } from '../../models/filme.model';
import type { ISala } from '../../models/sala.model';
import type { ISessao } from '../../models/sessao.model';

interface ComprarIngressoModalProps {
  show: boolean;
  onClose: () => void;
  sessao?: ISessao;
  filme?: IFilme;
  sala?: ISala;
  onCompraSuccess?: () => void;
}

export default function ComprarIngressoModal({
  show,
  onClose,
  sessao,
  filme,
  sala,
  onCompraSuccess,
}: ComprarIngressoModalProps) {
  const [assentosComprados, setAssentosComprados] = useState<string[]>([]);
  const [ingressosExistentes, setIngressosExistentes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (show && sessao) {
      carregarDados();
    }
  }, [show, sessao]);

  const carregarDados = async () => {
    if (!sessao) return;
    
    try {
      // Buscar ingressos existentes para esta sessão
      const response = await fetch(`http://localhost:4000/ingressos?sessaoId=${sessao.id}`);
      const ingressos = await response.json();
      
      // Extrair apenas os assentos ocupados
      const assentosOcupados = ingressos.map((ingresso: any) => ingresso.assento);
      setIngressosExistentes(assentosOcupados);
    } catch (erro) {
      console.error('Erro ao carregar ingressos existentes:', erro);
    }
  };

  const handleSelectSeat = (assento: string) => {
    setAssentosComprados(prev => {
      if (prev.includes(assento)) {
        return prev.filter(a => a !== assento);
      } else {
        return [...prev, assento];
      }
    });
  };

  const handleComprar = async () => {
    if (!sessao || !sala || assentosComprados.length === 0) {
      setError('Selecione pelo menos um assento');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const precoUnitario = sessao.preco;
      const dataCompra = new Date().toISOString().split('T')[0];

      // Criar ingressos para cada assento selecionado
      for (const assento of assentosComprados) {
        const ingresso = {
          id: uuidv4().substring(0, 4),
          sessaoId: sessao.id,
          assento,
          preco: precoUnitario,
          dataCompra,
          status: 'vendido',
        };

        await fetch('http://localhost:4000/ingressos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ingresso),
        });
      }

      // Atualizar assentos disponíveis na sessão
      // Buscar todos os ingressos já vendidos para esta sessão
      const ingressosResponse = await fetch(`http://localhost:4000/ingressos?sessaoId=${sessao.id}`);
      const ingressosAtuais = await ingressosResponse.json();
      const totalVendidos = ingressosAtuais.length;
      const novoDisponivelSessao = sala.capacidade - totalVendidos;
      
      await fetch(`http://localhost:4000/sessoes/${sessao.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assentosDisponiveis: novoDisponivelSessao,
        }),
      });

      // Atualizar assentos ocupados na sala (total de ingressos de todas as sessões desta sala)
      const sessoesSalaResponse = await fetch(`http://localhost:4000/sessoes?salaId=${sala.id}`);
      const sessoesSala = await sessoesSalaResponse.json();
      
      let totalOcupadosSala = 0;
      for (const sess of sessoesSala) {
        const ingressosSessResponse = await fetch(`http://localhost:4000/ingressos?sessaoId=${sess.id}`);
        const ingressosSess = await ingressosSessResponse.json();
        totalOcupadosSala += ingressosSess.length;
      }
      
      await fetch(`http://localhost:4000/salas/${sala.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assentosOcupados: totalOcupadosSala,
        }),
      });

      const precoTotal = precoUnitario * assentosComprados.length;
      setSuccessMessage(`${assentosComprados.length} ingresso(s) comprado(s) com sucesso! Total: R$ ${precoTotal.toFixed(2)}`);
      
      setTimeout(() => {
        setAssentosComprados([]);
        setSuccessMessage('');
        setError('');
        if (onCompraSuccess) {
          onCompraSuccess();
        }
        onClose();
      }, 2000);
    } catch (erro) {
      console.error('Erro ao comprar ingresso:', erro);
      setError('Erro ao comprar ingresso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !sessao || !filme || !sala) return null;

  const precoTotal = sessao.preco * assentosComprados.length;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-ticket-perforated"></i> Comprar Ingresso
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show">
                {error}
              </div>
            )}

            <div className="mb-4 p-3 bg-light rounded">
              <div className="row g-2">
                <div className="col-md-6">
                  <p className="mb-2"><strong>Filme:</strong> {filme.titulo}</p>
                  <p className="mb-0"><strong>Sala:</strong> {sala.numero} ({sala.tipo})</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2"><strong>Data/Hora:</strong> {sessao.data} às {sessao.horario}</p>
                  <p className="mb-0"><strong>Preço:</strong> R$ {sessao.preco.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="mb-3">Selecione seus assentos:</h6>
              <SeatMap
                capacidade={sala.capacidade}
                assentosOcupados={ingressosExistentes}
                assentosComprados={assentosComprados}
                onSelectSeat={handleSelectSeat}
              />
            </div>

            {assentosComprados.length > 0 && (
              <div className="mb-3 p-3 bg-info bg-opacity-10 rounded border border-info border-opacity-50">
                <p className="mb-2">
                  <strong>Assentos selecionados:</strong> <br />
                  {assentosComprados.sort().join(', ')}
                </p>
                <p className="mb-0">
                  <strong className="text-success">Total: R$ {precoTotal.toFixed(2)}</strong>
                </p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleComprar}
              disabled={loading || assentosComprados.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Comprar ({assentosComprados.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
