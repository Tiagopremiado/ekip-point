import React from 'react';
import { Team } from '../types';

interface HomeViewProps {
  teams: Team[];
}

const HomeTeamCard: React.FC<{ team: Team }> = ({ team }) => (
  <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden group">
    <div className="relative h-56">
      <img
        src={team.fotoUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'}
        alt={`Foto da ${team.nome}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-2xl font-bold text-white">{team.nome}</h3>
        <span className="text-sm font-semibold bg-emerald-600 text-white px-2 py-1 rounded-full">{team.unidade}</span>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-300 italic">"{team.descricao}"</p>
    </div>
  </div>
);

const HomeView: React.FC<HomeViewProps> = ({ teams }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {teams.map(team => (
        <HomeTeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};

export default HomeView;