import type { ISala } from '../models/sala.model';

const API_URL = 'http://localhost:4000';

export const salaService = {
    async listar(): Promise<ISala[]> {
        const response = await fetch(`${API_URL}/salas`);
        return response.json();
    },

    async obterPorId(id: string): Promise<ISala> {
        const response = await fetch(`${API_URL}/salas/${id}`);
        return response.json();
    },

    async criar(sala: ISala): Promise<ISala> {
        const response = await fetch(`${API_URL}/salas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sala),
        });
        return response.json();
    },

    async atualizar(id: string, sala: ISala): Promise<ISala> {
        const response = await fetch(`${API_URL}/salas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sala),
        });
        return response.json();
    },

    async deletar(id: string): Promise<void> {
        await fetch(`${API_URL}/salas/${id}`, {
            method: 'DELETE',
        });
    },
};
