import { z } from 'zod';

export interface IIngresso {
    id?: string;
    sessaoId: string;
    assento: string; // formato: A1, A2, etc
    preco: number;
    dataCompra: string;
    status: 'disponível' | 'vendido' | 'reservado';
}

export const ingressoSchema = z.object({
    id: z.string().optional(),
    sessaoId: z.string()
        .min(1, 'A sessão é obrigatória'),
    assento: z.string()
        .min(1, 'O assento é obrigatório'),
    preco: z.number()
        .min(1, 'O preço deve ser maior que 0'),
    dataCompra: z.string()
        .min(1, 'A data de compra é obrigatória'),
    status: z.enum(['disponível', 'vendido', 'reservado']),
});
