// ===== IMPORTS =====
import { useMemo } from 'react'; // Hook para memoização de cálculos
import './SeatMap.css'; // Estilos do mapa de assentos

// ===== INTERFACE DO COMPONENTE =====
// Define as propriedades aceitas pelo componente SeatMap
interface SeatMapProps {
  capacidade: number; // Capacidade total da sala (número de assentos)
  assentosOcupados?: number | string[]; // Array de assentos já ocupados/bloqueados
  assentosComprados: string[]; // Array de assentos selecionados para compra
  onSelectSeat: (assento: string) => void; // Callback quando um assento é selecionado
}

// ===== COMPONENTE SEATMAP =====
// Exibe um mapa interativo de assentos da sala de cinema
export function SeatMap({ capacidade, assentosOcupados = [], assentosComprados, onSelectSeat }: SeatMapProps) {
  // ===== CONVERTER PARA ARRAY SE FOR NÚMERO =====
  // Compatibilidade se assentosOcupados for passado como número
  const assentosOcupadosArray = Array.isArray(assentosOcupados) 
    ? assentosOcupados 
    : [];
  
  // ===== MEMOIZAR SET DE ASSENTOS OCUPADOS =====
  // Usa Set para busca rápida O(1) de assentos ocupados
  const assentosOcupadosSet = useMemo(() => {
    return new Set<string>(assentosOcupadosArray);
  }, [assentosOcupadosArray]);

  // ===== CÁLCULOS DO MAPA =====
  const fileiras = Math.ceil(capacidade / 10); // Número de fileiras (10 assentos por fileira)
  const assentosPorFileira = 10; // Assentos por fileira

  // ===== FUNÇÃO: Determina o status de um assento (disponível, ocupado, comprado) =====
  const getStatusAssento = (assento: string) => {
    if (assentosComprados.includes(assento)) return 'comprado';
    if (assentosOcupadosSet.has(assento)) return 'ocupado';
    return 'disponivel';
  };

  return (
    <div className="seat-map">
      {/* Tela do cinema */}
      <div className="tela-cinema">Tela do Cinema</div>
      
      {/* Container das fileiras */}
      <div className="fileiras">
        {/* Itera sobre cada fileira */}
        {Array.from({ length: fileiras }).map((_, fileira) => {
          const letraFileira = String.fromCharCode(65 + fileira); // Converte número para letra (A, B, C...)
          return (
            <div key={fileira} className="fileira">
              {/* Letra da fileira (A, B, C...) */}
              <div className="numero-fileira">{letraFileira}</div>
              {/* Container dos assentos da fileira */}
              <div className="assentos">
                {/* Itera sobre cada assento da fileira */}
                {Array.from({ length: assentosPorFileira }).map((_, coluna) => {
                  const numero = coluna + 1;
                  const assento = `${letraFileira}${numero}`; // Ex: A1, A2, B1...
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
