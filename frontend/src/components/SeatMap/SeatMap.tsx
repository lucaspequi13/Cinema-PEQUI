import { useMemo } from 'react';
import './SeatMap.css';

interface SeatMapProps {
  capacidade: number;
  assentosOcupados?: number | string[];
  assentosComprados: string[];
  onSelectSeat: (assento: string) => void;
}

export function SeatMap({ capacidade, assentosOcupados = [], assentosComprados, onSelectSeat }: SeatMapProps) {
  // Converter para array se for número (para compatibilidade)
  const assentosOcupadosArray = Array.isArray(assentosOcupados) 
    ? assentosOcupados 
    : [];
  
  const assentosOcupadosSet = useMemo(() => {
    return new Set<string>(assentosOcupadosArray);
  }, [assentosOcupadosArray]);

  const fileiras = Math.ceil(capacidade / 10);
  const assentosPorFileira = 10;

  const getStatusAssento = (assento: string) => {
    if (assentosComprados.includes(assento)) return 'comprado';
    if (assentosOcupadosSet.has(assento)) return 'ocupado';
    return 'disponivel';
  };

  return (
    <div className="seat-map">
      <div className="tela-cinema">Tela do Cinema</div>
      
      <div className="fileiras">
        {Array.from({ length: fileiras }).map((_, fileira) => {
          const letraFileira = String.fromCharCode(65 + fileira);
          return (
            <div key={fileira} className="fileira">
              <div className="numero-fileira">{letraFileira}</div>
              <div className="assentos">
                {Array.from({ length: assentosPorFileira }).map((_, coluna) => {
                  const numero = coluna + 1;
                  const assento = `${letraFileira}${numero}`;
                  const status = getStatusAssento(assento);
                  const isSelecionado = assentosComprados.includes(assento);
                  const classNameAssento = isSelecionado 
                    ? 'assento assento-selecionado'
                    : `assento assento-${status}`;

                  return (
                    <button
                      key={assento}
                      className={classNameAssento}
                      onClick={() => onSelectSeat(assento)}
                      disabled={status === 'ocupado'}
                      title={`Assento ${assento}`}
                    >
                      {numero}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="legenda-assentos mt-3">
        <div className="legenda-item">
          <span className="assento assento-disponivel"></span>
          <small>Disponível</small>
        </div>
        <div className="legenda-item">
          <span className="assento assento-ocupado"></span>
          <small>Ocupado</small>
        </div>
        <div className="legenda-item">
          <span className="assento assento-comprado"></span>
          <small>Selecionado</small>
        </div>
      </div>
    </div>
  );
}
