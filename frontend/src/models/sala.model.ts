import { z } from 'zod';

export interface ISala {
    id?: string;
    numero: number;
    capacidade: number;
    tipo: 'padrão' | '3D' | 'IMAX' | '4DX';
    assentosOcupados: number;
    vip?: boolean;
    temperaturAC?: number;
}

export const salaSchema = z.object({
    id: z.string().optional(),
    numero: z.number()
        .min(1, 'O número da sala deve ser maior que 0'),
    capacidade: z.number()
        .min(1, 'A capacidade deve ser maior que 0')
        .max(500, 'A capacidade não pode exceder 500 lugares'),
    tipo: z.enum(['padrão', '3D', 'IMAX', '4DX']),
    assentosOcupados: z.number()
        .min(0, 'Assentos ocupados não pode ser negativo')
        .default(0),
});
