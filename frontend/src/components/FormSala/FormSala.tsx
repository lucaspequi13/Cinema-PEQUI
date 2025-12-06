import { useState } from 'react';
import type { ISala } from '../../models/sala.model';
import { salaSchema } from '../../models/sala.model';
import { salaService } from '../../services/sala.service';

interface FormSalaProps {
  onSuccess?: () => void;
}

export function FormSala({ onSuccess }: FormSalaProps) {
  const [formData, setFormData] = useState<ISala>({
    numero: 0,
    capacidade: 0,
    tipo: 'padrão',
    assentosOcupados: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numero' || name === 'capacidade' ? parseInt(value) || 0 : value,
    }));
    // Limpar erro do campo
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
      // Validar com Zod
      const validacao = salaSchema.safeParse(formData);
      
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
      await salaService.criar(formData);
      
      // Limpar formulário
      setFormData({
        numero: 0,
        capacidade: 0,
        tipo: 'padrão',
        assentosOcupados: 0,
      });
      setErrors({});
      
      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
      alert('Sala adicionada com sucesso!');
    } catch (erro) {
      console.error('Erro ao criar sala:', erro);
      setErrors({ submit: 'Erro ao criar sala. Tente novamente.' });
      alert('Erro ao criar sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="bi bi-plus-circle"></i> Adicionar Nova Sala
        </h5>

        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="numero" className="form-label">Número da Sala *</label>
              <input
                type="number"
                className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                id="numero"
                name="numero"
                value={formData.numero || ''}
                onChange={handleChange}
                placeholder="Ex: 1, 2, 3..."
              />
              {errors.numero && <div className="invalid-feedback d-block">{errors.numero}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="capacidade" className="form-label">Capacidade de Lugares *</label>
              <input
                type="number"
                className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
                id="capacidade"
                name="capacidade"
                value={formData.capacidade || ''}
                onChange={handleChange}
                placeholder="Ex: 100, 150..."
              />
              {errors.capacidade && <div className="invalid-feedback d-block">{errors.capacidade}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="tipo" className="form-label">Tipo de Sala *</label>
            <select
              className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="padrão">Padrão</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
              <option value="4DX">4DX</option>
            </select>
            {errors.tipo && <div className="invalid-feedback d-block">{errors.tipo}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Adicionando...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle"></i> Adicionar Sala
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
