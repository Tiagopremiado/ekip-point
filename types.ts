// Fix: Define the types for the application.
export type Unit = 'Pelotas' | 'Pedro Osório';

export interface Team {
  id: string;
  nome: string;
  unidade: Unit;
  pontos: number;
  descricao: string;
  foPositivos: string[];
  foNegativos: string[];
  fotoUrl?: string;
}

export interface Confronto {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Score: number;
  team2Score: number;
  date: string; // YYYY-MM-DD
  description: string;
  unidade: Unit;
}