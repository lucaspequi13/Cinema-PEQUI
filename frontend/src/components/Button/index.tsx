

// ===== INTERFACE DO COMPONENTE BUTTON =====
// Define as propriedades aceitas pelo componente Button
interface ButtonProps {
    value: string; // Texto exibido no botão
    type?: 'button' | 'submit' | 'reset'; // Tipo de botão HTML
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'; // Estilo/cor do botão (Bootstrap)
    onClick: () => void; // Callback quando botão é clicado
    disabled?: boolean; // Se o botão está desabilitado
}

// ===== COMPONENTE BUTTON =====
// Botão reutilizável com suporte a diferentes estilos Bootstrap
export const Button = (
    { value, type = 'button', variant = 'primary', onClick, disabled = false }: ButtonProps
) => {
    return (
        <>
            <div className="d-grid">
                {/* Botão com classe dinâmica de variante */}
                <button
                    type={type}
                    className={`btn btn-${variant}`}
                    onClick={onClick}
                    disabled={disabled}
                >
                    {value}
                </button>
            </div>
        </>
    );
};