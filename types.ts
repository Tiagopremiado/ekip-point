// Fix: Define the types for the application.
export type Unit = 'Pelotas' | 'Pedro Osório';

export interface Team {
  id: string;
  nome: string;
  unidade: Unit;
  pontos: number;
  descricao: string;
  fatosPositivos: string[];
  fatosNegativos: string[];
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

export interface TeamComment {
  id: string;
  team_id: string;
  comment: string;
  created_at: string;
}
