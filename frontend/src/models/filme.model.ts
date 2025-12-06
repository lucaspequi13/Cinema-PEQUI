import { z } from 'zod';

export type Classificacao = 'L' | '10' | '12' | '14' | '16' | '18';

export interface IFilme {
    id?: string;
    titulo: string;
    descricao: string;
    classificacao: Classificacao;
    duracao: number; // em minutos
    genero: string;
    poster: string; // URL da imagem
    diretor: string;
    dataLancamento: string;
    nota?: number; // nota de 0 a 10
}

export const filmeSchema = z.object({
    id: z.string().optional(),
    titulo: z.string()
        .min(1, 'O título é obrigatório')
        .min(3, 'O título deve ter no mínimo 3 caracteres'),
    descricao: z.string()
        .min(1, 'A descrição é obrigatória')
        .min(10, 'A descrição deve ter no mínimo 10 caracteres'),
    classificacao: z.enum(['L', '10', '12', '14', '16', '18']),
    duracao: z.number()
        .min(1, 'A duração deve ser maior que 0'),
    genero: z.string()
        .min(1, 'O gênero é obrigatório'),
    poster: z.string()
        .min(1, 'A URL do poster é obrigatória'),
    diretor: z.string()
        .min(1, 'O diretor é obrigatório'),
    dataLancamento: z.string()
        .min(1, 'A data de lançamento é obrigatória'),
});
