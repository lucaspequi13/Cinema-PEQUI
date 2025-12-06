import { z } from 'zod';

export interface ISessao {
    id?: string;
    filmeId: string;
    salaId: string;
    horario: string; // formato HH:MM
    data: string; // formato YYYY-MM-DD
    preco: number;
    assentosDisponiveis: number;
}

export const sessaoSchema = z.object({
    id: z.string().optional(),
    filmeId: z.string()
        .min(1, 'O filme é obrigatório'),
    salaId: z.string()
        .min(1, 'A sala é obrigatória'),
    horario: z.string()
        .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
    data: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    preco: z.number()
        .min(1, 'O preço deve ser maior que 0'),
    assentosDisponiveis: z.number()
        .min(0, 'Assentos disponíveis não pode ser negativo'),
});
