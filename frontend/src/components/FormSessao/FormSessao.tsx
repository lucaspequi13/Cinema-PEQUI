// ===== IMPORTS =====
import { useState, useEffect } from 'react'; // Hooks de estado e efeito
import type { ISessao } from '../../models/sessao.model'; // Interface de sessão
import { sessaoSchema } from '../../models/sessao.model'; // Schema de validação
import { sessaoService } from '../../services/sessao.service'; // Serviço de sessões
import { filmeService } from '../../services/filme.service'; // Serviço de filmes
import { salaService } from '../../services/sala.service'; // Serviço de salas
import type { IFilme } from '../../models/filme.model'; // Interface de filme
import type { ISala } from '../../models/sala.model'; // Interface de sala

// ===== INTERFACE DO COMPONENTE =====
// Define as propriedades aceitas pelo componente FormSessao
interface FormSessaoProps {
  onSuccess?: () => void; // Callback ao salvar com sucesso
}

// ===== COMPONENTE FORMSESSAO =====
// Formulário para criar/editar sessões de cinema
export function FormSessao({ onSuccess }: FormSessaoProps) {
  // ===== ESTADO: Dados do formulário =====
  const [formData, setFormData] = useState<ISessao>({
    filmeId: '',
    salaId: '',
    horario: '',
    data: '',
    preco: 0,
    assentosDisponiveis: 0,
  });

  // ===== ESTADOS: Opções de filmes e salas =====
  const [filmes, setFilmes] = useState<IFilme[]>([]); // Lista de filmes disponíveis
  const [salas, setSalas] = useState<ISala[]>([]); // Lista de salas disponíveis
  
  // ===== ESTADOS: Validação e feedback =====
  const [errors, setErrors] = useState<Record<string, string>>({}); // Erros de validação
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // ===== EFEITO: Carregar filmes e salas ao montar componente =====
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const filmesData = await filmeService.listar();
      const salasData = await salaService.listar();
      setFilmes(filmesData);
      setSalas(salasData);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Quando selecionar uma sala, preencher assentosDisponiveis com a capacidade
    if (name === 'salaId') {
      const salaSelected = salas.find(s => s.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        assentosDisponiveis: salaSelected?.capacidade || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'preco' ? parseFloat(value) || 0 : value,
      }));
    }

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
      const validacao = sessaoSchema.safeParse(formData);
      
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
      await sessaoService.criar(formData);
      
      // Limpar formulário
      setFormData({
        filmeId: '',
        salaId: '',
        horario: '',
        data: '',
        preco: 0,
        assentosDisponiveis: 0,
      });
      setErrors({});
      
      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
      alert('Sessão adicionada com sucesso!');
    } catch (erro) {
      console.error('Erro ao criar sessão:', erro);
      setErrors({ submit: 'Erro ao criar sessão. Tente novamente.' });
      alert('Erro ao criar sessão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="bi bi-plus-circle"></i> Adicionar Nova Sessão
        </h5>

        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="filmeId" className="form-label">Filme *</label>
            <select
              className={`form-control ${errors.filmeId ? 'is-invalid' : ''}`}
              id="filmeId"
              name="filmeId"
              value={formData.filmeId}
              onChange={handleChange}
            >
              <option value="">Selecione um filme</option>
              {filmes.map(filme => (
                <option key={filme.id} value={filme.id}>
                  {filme.titulo}
                </option>
              ))}
            </select>
            {errors.filmeId && <div className="invalid-feedback d-block">{errors.filmeId}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="salaId" className="form-label">Sala *</label>
            <select
              className={`form-control ${errors.salaId ? 'is-invalid' : ''}`}
              id="salaId"
              name="salaId"
              value={formData.salaId}
              onChange={handleChange}
            >
              <option value="">Selecione uma sala</option>
              {salas.map(sala => (
                <option key={sala.id} value={sala.id}>
                  Sala {sala.numero} - {sala.tipo} - Capacidade: {sala.capacidade}
                </option>
              ))}
            </select>
            {errors.salaId && <div className="invalid-feedback d-block">{errors.salaId}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="data" className="form-label">Data *</label>
              <input
                type="date"
                className={`form-control ${errors.data ? 'is-invalid' : ''}`}
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
              />
              {errors.data && <div className="invalid-feedback d-block">{errors.data}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="horario" className="form-label">Horário (HH:MM) *</label>
              <input
                type="time"
                className={`form-control ${errors.horario ? 'is-invalid' : ''}`}
                id="horario"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
              />
              {errors.horario && <div className="invalid-feedback d-block">{errors.horario}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="preco" className="form-label">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
                id="preco"
                name="preco"
                value={formData.preco || ''}
                onChange={handleChange}
              />
              {errors.preco && <div className="invalid-feedback d-block">{errors.preco}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="assentosDisponiveis" className="form-label">Assentos Disponíveis</label>
              <input
                type="number"
                className="form-control"
                id="assentosDisponiveis"
                name="assentosDisponiveis"
                value={formData.assentosDisponiveis}
                disabled
              />
              <small className="text-muted">Preenchido automaticamente com a capacidade da sala</small>
            </div>
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
                <i className="bi bi-plus-circle"></i> Adicionar Sessão
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
