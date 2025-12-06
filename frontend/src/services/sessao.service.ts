import type { ISessao } from '../models/sessao.model';

const API_URL = 'http://localhost:4000';

export const sessaoService = {
    async listar(): Promise<ISessao[]> {
        const response = await fetch(`${API_URL}/sessoes`);
        return response.json();
    },

    async obterPorId(id: string): Promise<ISessao> {
        const response = await fetch(`${API_URL}/sessoes/${id}`);
        return response.json();
    },

    async obterPorFilme(filmeId: string): Promise<ISessao[]> {
        const response = await fetch(`${API_URL}/sessoes?filmeId=${filmeId}`);
        return response.json();
    },

    async criar(sessao: ISessao): Promise<ISessao> {
        const response = await fetch(`${API_URL}/sessoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessao),
        });
        return response.json();
    },

    async atualizar(id: string, sessao: ISessao): Promise<ISessao> {
        const response = await fetch(`${API_URL}/sessoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessao),
        });
        return response.json();
    },

    async deletar(id: string): Promise<void> {
        await fetch(`${API_URL}/sessoes/${id}`, {
            method: 'DELETE',
        });
    },
};
