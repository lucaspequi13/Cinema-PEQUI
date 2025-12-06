import type { IIngresso } from '../models/ingresso.model';

const API_URL = 'http://localhost:4000';

export const ingressoService = {
    async listar(): Promise<IIngresso[]> {
        const response = await fetch(`${API_URL}/ingressos`);
        return response.json();
    },

    async obterPorId(id: string): Promise<IIngresso> {
        const response = await fetch(`${API_URL}/ingressos/${id}`);
        return response.json();
    },

    async obterPorSessao(sessaoId: string): Promise<IIngresso[]> {
        const response = await fetch(`${API_URL}/ingressos?sessaoId=${sessaoId}`);
        return response.json();
    },

    async criar(ingresso: IIngresso): Promise<IIngresso> {
        const response = await fetch(`${API_URL}/ingressos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingresso),
        });
        return response.json();
    },

    async atualizar(id: string, ingresso: IIngresso): Promise<IIngresso> {
        const response = await fetch(`${API_URL}/ingressos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingresso),
        });
        return response.json();
    },

    async deletar(id: string): Promise<void> {
        await fetch(`${API_URL}/ingressos/${id}`, {
            method: 'DELETE',
        });
    },
};
