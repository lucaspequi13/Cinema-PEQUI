// ===== INTERFACE DO COMPONENTE INPUT =====
// Define as propriedades aceitas pelo componente Input
interface InputProps {
    id?: string; // ID único do input para acessibilidade
    label: string; // Texto do rótulo do input
    visible?: "none" | "true" | "false"; // Controla visibilidade do rótulo
    type: 'text' | 'number' | 'email' | 'password' | 'date'; // Tipo de input HTML
    value: string; // Valor atual do input
    placeholder?: string; // Texto de sugestão dentro do input
    disabled?: boolean; // Se o input está desabilitado
    error?: string; // Mensagem de erro a exibir
    onChange: (value: string) => void; // Callback quando valor muda
}

// ===== COMPONENTE INPUT =====
// Componente de entrada de texto com suporte a validação de erro
export const Input = ({ id, label, visible = "none", type, value, placeholder = '', disabled = false, error, onChange }: InputProps) => {
    return (
        <>
            <div className="d-grid">
                {/* Exibe rótulo apenas se visible = "true" */}
                { visible === "true" ? <label htmlFor={id} className="form-label" >{label}</label> : null }
                {/* Input com classe de erro se houver validação */}
                <input 
                    id={id}
                    type={type} 
                    className={`form-control mb-1 ${error ? 'is-invalid' : ''}`}
                    value={value} 
                    placeholder={placeholder} 
                    disabled={disabled} 
                    onChange={(e) => onChange(e.target.value)} 
                />
                {/* Mensagem de erro em vermelho abaixo do input */}
                {error && <div className="invalid-feedback d-block mb-2">{error}</div>}
            </div>
        </>
    );
};