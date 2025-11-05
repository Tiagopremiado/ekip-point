// Fix: Add a triple-slash directive to provide type definitions for Vite's `import.meta.env`.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';
import { Team, Confronto, Unit } from './types';

// Lê as credenciais das Variáveis de Ambiente.
// Na Vercel, ele usará as variáveis que você configurou no painel.
// Localmente, ele procuraria por um arquivo .env.local (que não temos, mas é a prática padrão).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Erro de configuração: As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram definidas.");
}

interface Database {
  public: {
    Tables: {
      teams: {
        Row: Team;
        // Fix: Using explicit types for Insert and Update to avoid generic type resolution issues.
        Insert: {
          nome: string;
          unidade: Unit;
          pontos: number;
          descricao: string;
          foPositivos: string[];
          foNegativos: string[];
          fotoUrl?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          unidade?: Unit;
          pontos?: number;
          descricao?: string;
          foPositivos?: string[];
          foNegativos?: string[];
          fotoUrl?: string;
        };
      };
      confrontos: {
        Row: Confronto;
        // Fix: Using explicit types for Insert and Update to avoid generic type resolution issues.
        Insert: {
          team1Id: string;
          team2Id: string;
          team1Score: number;
          team2Score: number;
          date: string;
          description: string;
          unidade: Unit;
        };
        Update: {
          id?: string;
          team1Id?: string;
          team2Id?: string;
          team1Score?: number;
          team2Score?: number;
          date?: string;
          description?: string;
          unidade?: Unit;
        };
      };
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
