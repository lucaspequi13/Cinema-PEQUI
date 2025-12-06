import { useState } from 'react';
import type { IFilme } from '../../models/filme.model';
import { filmeSchema } from '../../models/filme.model';
import { filmeService } from '../../services/filme.service';

interface FormFilmeProps {
  onSuccess?: () => void;
}

export function FormFilme({ onSuccess }: FormFilmeProps) {
  const [formData, setFormData] = useState<IFilme>({
    titulo: '',
    descricao: '',
    classificacao: 'L',
    duracao: 0,
    genero: '',
    poster: '',
    diretor: '',
    dataLancamento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duracao' ? parseInt(value) || 0 : value,
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
      const validacao = filmeSchema.safeParse(formData);
      
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
      await filmeService.criar(formData);
      
      // Limpar formulário
      setFormData({
        titulo: '',
        descricao: '',
        classificacao: 'L',
        duracao: 0,
        genero: '',
        poster: '',
        diretor: '',
        dataLancamento: '',
      });
      setErrors({});
      
      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
      alert('Filme adicionado com sucesso!');
    } catch (erro) {
      console.error('Erro ao criar filme:', erro);
      setErrors({ submit: 'Erro ao criar filme. Tente novamente.' });
      alert('Erro ao criar filme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="bi bi-plus-circle"></i> Adicionar Novo Filme
        </h5>

        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="titulo" className="form-label">Título *</label>
              <input
                type="text"
                className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
              />
              {errors.titulo && <div className="invalid-feedback d-block">{errors.titulo}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="diretor" className="form-label">Diretor *</label>
              <input
                type="text"
                className={`form-control ${errors.diretor ? 'is-invalid' : ''}`}
                id="diretor"
                name="diretor"
                value={formData.diretor}
                onChange={handleChange}
              />
              {errors.diretor && <div className="invalid-feedback d-block">{errors.diretor}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">Descrição *</label>
            <textarea
              className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
              id="descricao"
              name="descricao"
              rows={3}
              value={formData.descricao}
              onChange={handleChange}
            />
            {errors.descricao && <div className="invalid-feedback d-block">{errors.descricao}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="genero" className="form-label">Gênero *</label>
              <input
                type="text"
                className={`form-control ${errors.genero ? 'is-invalid' : ''}`}
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
              />
              {errors.genero && <div className="invalid-feedback d-block">{errors.genero}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="classificacao" className="form-label">Classificação *</label>
              <select
                className={`form-control ${errors.classificacao ? 'is-invalid' : ''}`}
                id="classificacao"
                name="classificacao"
                value={formData.classificacao}
                onChange={handleChange}
              >
                <option value="L">L - Livre</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
                <option value="18">18 anos</option>
              </select>
              {errors.classificacao && <div className="invalid-feedback d-block">{errors.classificacao}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="duracao" className="form-label">Duração (minutos) *</label>
              <input
                type="number"
                className={`form-control ${errors.duracao ? 'is-invalid' : ''}`}
                id="duracao"
                name="duracao"
                value={formData.duracao || ''}
                onChange={handleChange}
              />
              {errors.duracao && <div className="invalid-feedback d-block">{errors.duracao}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="dataLancamento" className="form-label">Data de Lançamento *</label>
              <input
                type="date"
                className={`form-control ${errors.dataLancamento ? 'is-invalid' : ''}`}
                id="dataLancamento"
                name="dataLancamento"
                value={formData.dataLancamento}
                onChange={handleChange}
              />
              {errors.dataLancamento && <div className="invalid-feedback d-block">{errors.dataLancamento}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="poster" className="form-label">URL do Poster *</label>
            <input
              type="text"
              className={`form-control ${errors.poster ? 'is-invalid' : ''}`}
              id="poster"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              placeholder="https://exemplo.com/poster.jpg"
            />
            {errors.poster && <div className="invalid-feedback d-block">{errors.poster}</div>}
            
            {formData.poster && (
              <div className="mt-3">
                <p className="text-muted small">Preview:</p>
                <img
                  src={formData.poster}
                  alt="Poster"
                  style={{
                    maxWidth: '150px',
                    maxHeight: '200px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    padding: '4px',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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
                <i className="bi bi-plus-circle"></i> Adicionar Filme
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
