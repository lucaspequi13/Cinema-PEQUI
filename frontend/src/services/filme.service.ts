import type { IFilme } from '../models/filme.model';

const API_URL = 'http://localhost:4000';

export const filmeService = {
    async listar(): Promise<IFilme[]> {
        const response = await fetch(`${API_URL}/filmes`);
        return response.json();
    },

    async obterPorId(id: string): Promise<IFilme> {
        const response = await fetch(`${API_URL}/filmes/${id}`);
        return response.json();
    },

    async criar(filme: IFilme): Promise<IFilme> {
        const response = await fetch(`${API_URL}/filmes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filme),
        });
        return response.json();
    },

    async atualizar(id: string, filme: IFilme): Promise<IFilme> {
        const response = await fetch(`${API_URL}/filmes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filme),
        });
        return response.json();
    },

    async deletar(id: string): Promise<void> {
        await fetch(`${API_URL}/filmes/${id}`, {
            method: 'DELETE',
        });
    },
};
