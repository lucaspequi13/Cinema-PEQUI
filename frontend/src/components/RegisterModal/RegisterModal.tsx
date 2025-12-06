import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { IUsuario } from '../../models/usuario.model';
import { usuarioSchema } from '../../models/usuario.model';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onRegisterSuccess?: () => void;
}

export function RegisterModal({ show, onClose, onRegisterSuccess }: RegisterModalProps) {
  const [formData, setFormData] = useState<IUsuario>({
    nome: '',
    email: '',
    senha: '',
    status: 'ativo',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validacao = usuarioSchema.safeParse(formData);
      
      if (!validacao.success) {
        const novoErros: Record<string, string> = {};
        validacao.error.issues.forEach((erro: any) => {
          const campo = erro.path[0] as string;
          novoErros[campo] = erro.message;
        });
        setErrors(novoErros);
        return;
      }

      setLoading(true);
      const novoUsuario = {
        ...formData,
        id: uuidv4().substring(0, 4),
      };
      const response = await fetch('http://localhost:4000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario),
      });

      if (response.ok) {
        setSuccessMessage('Usuário registrado com sucesso!');
        setTimeout(() => {
          setFormData({
            nome: '',
            email: '',
            senha: '',
            status: 'ativo',
          });
          setErrors({});
          setSuccessMessage('');
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
          onClose();
        }, 2000);
      } else {
        setErrors({ submit: 'Erro ao registrar usuário' });
      }
    } catch (erro) {
      console.error('Erro:', erro);
      setErrors({ submit: 'Erro ao registrar usuário. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-plus"></i> Registrar Novo Usuário
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
              <div className="alert alert-success">{successMessage}</div>
            )}
            {errors.submit && (
              <div className="alert alert-danger">{errors.submit}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">Nome *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
                {errors.nome && <div className="invalid-feedback d-block">{errors.nome}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha *</label>
                <input
                  type="password"
                  className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                />
                {errors.senha && <div className="invalid-feedback d-block">{errors.senha}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i> Registrar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
