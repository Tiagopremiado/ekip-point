
import React from 'react';
import { Team } from '../types';

interface TeamCardProps {
  team: Team;
  rank?: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, rank }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 relative">
      {rank && (
        <div className="absolute top-0 left-0 bg-emerald-600 text-white font-bold text-lg px-4 py-2 rounded-br-lg">
          #{rank}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white mb-1">{team.nome}</h3>
            <span className="text-2xl font-black text-emerald-400">{team.pontos} pts</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">{team.unidade}</p>
        <p className="text-gray-300 mb-6 h-12">{team.descricao}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-emerald-400 mb-2">F.O+ (Forças Observadas Positivas)</h4>
            {team.foPositivos.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {team.foPositivos.map((fo, index) => (
                  <li key={index} className="bg-emerald-900/50 text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full">
                    {fo}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500 italic text-sm">Nenhuma observação.</p>}
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-2">F.O- (Forças Observadas Negativas)</h4>
             {team.foNegativos.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {team.foNegativos.map((fo, index) => (
                  <li key={index} className="bg-red-900/50 text-red-300 text-xs font-medium px-2.5 py-1 rounded-full">
                    {fo}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500 italic text-sm">Nenhuma observação.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
