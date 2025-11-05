import React from 'react';
import { Confronto, Team } from '../types';

interface ConfrontoCardProps {
  confronto: Confronto;
  teams: Team[];
}

const ConfrontoCard: React.FC<ConfrontoCardProps> = ({ confronto, teams }) => {
  const team1 = teams.find(t => t.id === confronto.team1Id);
  const team2 = teams.find(t => t.id === confronto.team2Id);

  const getWinnerClass = (teamScore: number, otherTeamScore: number) => {
    if (teamScore > otherTeamScore) return 'text-emerald-400';
    if (teamScore < otherTeamScore) return 'text-red-400';
    return 'text-gray-300';
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
        <div className="flex justify-between items-center">
            <div className="text-center w-2/5">
                <h3 className={`text-xl font-bold ${getWinnerClass(confronto.team1Score, confronto.team2Score)}`}>{team1?.nome || 'Equipe A'}</h3>
                <p className="text-sm text-gray-400">{team1?.unidade}</p>
            </div>
            <div className="text-center">
                 <span className={`text-4xl font-black ${getWinnerClass(confronto.team1Score, confronto.team2Score)}`}>{confronto.team1Score}</span>
                 <span className="text-2xl font-bold text-gray-500 mx-3">X</span>
                 <span className={`text-4xl font-black ${getWinnerClass(confronto.team2Score, confronto.team1Score)}`}>{confronto.team2Score}</span>
            </div>
            <div className="text-center w-2/5">
                 <h3 className={`text-xl font-bold ${getWinnerClass(confronto.team2Score, confronto.team1Score)}`}>{team2?.nome || 'Equipe B'}</h3>
                 <p className="text-sm text-gray-400">{team2?.unidade}</p>
            </div>
        </div>
        <div className="text-center mt-4 border-t border-gray-700 pt-4">
            <p className="text-gray-300 font-semibold">{confronto.description}</p>
            <p className="text-gray-500 text-sm mt-1">{new Date(confronto.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
        </div>
    </div>
  );
};

export default ConfrontoCard;
