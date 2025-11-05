import React, { useState, useMemo } from 'react';
import { Team, Confronto } from '../types';
import TeamCard from './TeamCard';
import ConfrontoCard from './ConfrontoCard';
import HomeView from './HomeView';
import UnitRankingCard from './UnitRankingCard';

interface PublicViewProps {
  teams: Team[];
  confrontos: Confronto[];
}

type PublicViewTab = 'Início' | 'Ranking' | 'Confrontos';
type RankingSubTab = 'Pelotas' | 'Pedro Osório' | 'Rank das Unidades';
type ConfrontosSubTab = 'Pelotas' | 'Pedro Osório' | 'Contra-Unidades';

const PublicView: React.FC<PublicViewProps> = ({ teams, confrontos }) => {
  const [activeTab, setActiveTab] = useState<PublicViewTab>('Início');
  const [activeRankingTab, setActiveRankingTab] = useState<RankingSubTab>('Pelotas');
  const [activeConfrontosTab, setActiveConfrontosTab] = useState<ConfrontosSubTab>('Pelotas');

  const teamsByUnit = useMemo(() => {
    const pelotas = teams.filter(t => t.unidade === 'Pelotas').sort((a, b) => b.pontos - a.pontos);
    const pedroOsorio = teams.filter(t => t.unidade === 'Pedro Osório').sort((a, b) => b.pontos - a.pontos);
    return { pelotas, pedroOsorio };
  }, [teams]);

  const unitScores = useMemo(() => {
    const pelotasScore = teamsByUnit.pelotas.reduce((sum, team) => sum + team.pontos, 0);
    const pedroOsorioScore = teamsByUnit.pedroOsorio.reduce((sum, team) => sum + team.pontos, 0);
    return { pelotasScore, pedroOsorioScore };
  }, [teamsByUnit]);

  const confrontosByMatchup = useMemo(() => {
    const getTeam = (id: string) => teams.find(t => t.id === id);
    const sorted = [...confrontos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const pelotas = sorted.filter(c => getTeam(c.team1Id)?.unidade === 'Pelotas' && getTeam(c.team2Id)?.unidade === 'Pelotas');
    const pedroOsorio = sorted.filter(c => getTeam(c.team1Id)?.unidade === 'Pedro Osório' && getTeam(c.team2Id)?.unidade === 'Pedro Osório');
    const contraUnidades = sorted.filter(c => {
        const t1 = getTeam(c.team1Id);
        const t2 = getTeam(c.team2Id);
        return t1 && t2 && t1.unidade !== t2.unidade;
    });

    return { pelotas, pedroOsorio, contraUnidades };
  }, [confrontos, teams]);

  const renderRankingContent = () => {
    switch (activeRankingTab) {
      case 'Pelotas':
        return teamsByUnit.pelotas.length > 0 ? teamsByUnit.pelotas.map((team, index) => <TeamCard key={team.id} team={team} rank={index + 1} />) : <p className="text-center text-gray-400 col-span-full">Nenhuma equipe para esta unidade.</p>;
      case 'Pedro Osório':
        return teamsByUnit.pedroOsorio.length > 0 ? teamsByUnit.pedroOsorio.map((team, index) => <TeamCard key={team.id} team={team} rank={index + 1} />) : <p className="text-center text-gray-400 col-span-full">Nenhuma equipe para esta unidade.</p>;
      case 'Rank das Unidades':
        return <UnitRankingCard pelotasScore={unitScores.pelotasScore} pedroOsorioScore={unitScores.pedroOsorioScore} />;
    }
  };

  const renderConfrontosContent = () => {
    let confrontosToRender: Confronto[] = [];
    switch (activeConfrontosTab) {
        case 'Pelotas': confrontosToRender = confrontosByMatchup.pelotas; break;
        case 'Pedro Osório': confrontosToRender = confrontosByMatchup.pedroOsorio; break;
        case 'Contra-Unidades': confrontosToRender = confrontosByMatchup.contraUnidades; break;
    }
    return confrontosToRender.length > 0 ? confrontosToRender.map(c => <ConfrontoCard key={c.id} confronto={c} teams={teams} />) : <p className="text-center text-gray-400 col-span-full">Nenhum confronto para esta categoria.</p>;
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'Início':
        return <HomeView teams={teams} />;
      case 'Ranking':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderRankingContent()}
          </div>
        );
      case 'Confrontos':
        return (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderConfrontosContent()}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Dinâmica de Equipes</h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">Acompanhe a pontuação, os confrontos e o desenvolvimento das equipes.</p>
      </div>

       <div className="mb-8 p-1.5 bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-center gap-2 max-w-lg mx-auto">
        {(['Início', 'Ranking', 'Confrontos'] as PublicViewTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
              activeTab === tab ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Ranking' && (
        <div className="mb-8 p-1.5 bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
            {(['Pelotas', 'Pedro Osório', 'Rank das Unidades'] as RankingSubTab[]).map(subTab => (
            <button
                key={subTab}
                onClick={() => setActiveRankingTab(subTab)}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
                activeRankingTab === subTab ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
                {subTab}
            </button>
            ))}
        </div>
      )}

      {activeTab === 'Confrontos' && (
        <div className="mb-8 p-1.5 bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
            {(['Pelotas', 'Pedro Osório', 'Contra-Unidades'] as ConfrontosSubTab[]).map(subTab => (
            <button
                key={subTab}
                onClick={() => setActiveConfrontosTab(subTab)}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
                activeConfrontosTab === subTab ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
                {subTab}
            </button>
            ))}
        </div>
      )}
      
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default PublicView;