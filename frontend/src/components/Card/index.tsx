

// ===== INTERFACE DO COMPONENTE CARD =====
// Define as propriedades aceitas pelo componente Card
interface CardProps {
  title: string; // Título do card
  content: string; // Conteúdo principal do card
  footer?: string; // Rodapé opcional do card
}

// ===== COMPONENTE CARD =====
// Card reutilizável para exibir informações em formato de caixa
export const Card = ({ title, content, footer }: CardProps) => {
  return (
    <div className="card">
      <div className="card-body">
        {/* Título do card */}
        <h5 className="card-title">{title}</h5>
        {/* Conteúdo principal */}
        <p className="card-text">{content}</p>
        {/* Rodapé opcional em texto pequeno e cinza */}
        {footer && <small className="text-muted">{footer}</small>}
      </div>
    </div>
  );
};