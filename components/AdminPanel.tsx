import React, { useState, useMemo } from 'react';
import { Team, Unit, Confronto, TeamComment } from '../types';
import { EditIcon, DeleteIcon, PlusIcon, MinusIcon, LogoutIcon, CommentIcon } from './Icons';
import Modal from './Modal';
import ConfrontoModal from './ConfrontoModal';
import CommentsModal from './CommentsModal';

interface AdminPanelProps {
  teams: Team[];
  confrontos: Confronto[];
  comments: TeamComment[];
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addConfronto: (confronto: Omit<Confronto, 'id'>) => Promise<void>;
  updateConfronto: (confronto: Confronto) => Promise<void>;
  deleteConfronto: (id: string) => Promise<void>;
  addComment: (teamId: string, comment: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  onLogout: () => void;
}

type AdminView = 'Equipes' | 'Confrontos';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    teams, confrontos, comments,
    addTeam, updateTeam, deleteTeam, 
    addConfronto, updateConfronto, deleteConfronto,
    addComment, deleteComment,
    onLogout 
}) => {
  const [activeUnit, setActiveUnit] = useState<Unit>('Pelotas');
  const [adminView, setAdminView] = useState<AdminView>('Equipes');
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [isConfrontoModalOpen, setIsConfrontoModalOpen] = useState(false);
  const [editingConfronto, setEditingConfronto] = useState<Confronto | null>(null);
  
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedTeamForComments, setSelectedTeamForComments] = useState<Team | null>(null);


  const unitTeams = useMemo(() => teams.filter(team => team.unidade === activeUnit).sort((a,b) => b.pontos - a.pontos), [teams, activeUnit]);
  const unitConfrontos = useMemo(() => confrontos.filter(c => {
      const team1 = teams.find(t => t.id === c.team1Id);
      return team1 && team1.unidade === activeUnit;
  }), [confrontos, teams, activeUnit]);

  // Team Modal Handlers
  const openCreateTeamModal = () => { setEditingTeam(null); setIsTeamModalOpen(true); };
  const openEditTeamModal = (team: Team) => { setEditingTeam(team); setIsTeamModalOpen(true); };
  const handleSaveTeam = async (teamData: Omit<Team, 'id'> | Team) => {
    try {
        if ('id' in teamData) await updateTeam(teamData as Team); else await addTeam(teamData);
    } catch (error) {
        console.error("Failed to save team:", error);
        alert("Erro ao salvar equipe.");
    }
  };
  const handleDeleteTeam = async (id: string) => { 
      if (window.confirm("Excluir esta equipe? Todos os confrontos e comentários associados também serão removidos.")) {
          try {
              await deleteTeam(id);
          } catch(error) {
              console.error("Failed to delete team:", error);
              alert("Erro ao excluir equipe.");
          }
      }
  };
  const adjustPoints = (team: Team, amount: number) => {
      updateTeam({ ...team, pontos: team.pontos + amount }).catch(error => {
        console.error("Failed to adjust points:", error);
        alert("Erro ao ajustar pontos.");
      });
  };

  // Confronto Modal Handlers
  const openCreateConfrontoModal = () => { setEditingConfronto(null); setIsConfrontoModalOpen(true); };
  const openEditConfrontoModal = (confronto: Confronto) => { setEditingConfronto(confronto); setIsConfrontoModalOpen(true); };
  const handleSaveConfronto = async (confrontoData: Omit<Confronto, 'id'> | Confronto) => {
      try {
        if('id' in confrontoData) await updateConfronto(confrontoData as Confronto); else await addConfronto(confrontoData);
      } catch (error) {
          console.error("Failed to save confronto:", error);
          alert("Erro ao salvar confronto.");
      }
  };
  const handleDeleteConfronto = async (id: string) => { 
      if(window.confirm("Excluir este confronto?")) {
          try {
            await deleteConfronto(id);
          } catch (error) {
            console.error("Failed to delete confronto:", error);
            alert("Erro ao excluir confronto.");
          }
      } 
  };
  
  // Comments Modal Handlers
  const openCommentsModal = (team: Team) => {
      setSelectedTeamForComments(team);
      setIsCommentsModalOpen(true);
  }

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.nome || 'Equipe Desconhecida';


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Painel Administrativo</h2>
        <button onClick={onLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <LogoutIcon /> Sair
        </button>
      </div>
      
      <div className="mb-6 p-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg flex justify-center gap-2">
        {(['Equipes', 'Confrontos'] as AdminView[]).map(view => (
            <button key={view} onClick={() => setAdminView(view)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 w-full sm:w-auto ${ adminView === view ? 'bg-emerald-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700' }`}>
                Gerenciar {view}
            </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="p-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-center gap-2 w-full sm:w-auto">
            {(['Pelotas', 'Pedro Osório'] as Unit[]).map(unit => (
            <button key={unit} onClick={() => setActiveUnit(unit)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 w-full ${ activeUnit === unit ? 'bg-emerald-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                Unidade {unit}
            </button>
            ))}
        </div>
         <button onClick={adminView === 'Equipes' ? openCreateTeamModal : openCreateConfrontoModal} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
            <PlusIcon /> Novo {adminView === 'Equipes' ? 'Equipe' : 'Confronto'}
        </button>
      </div>
      
      {adminView === 'Equipes' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700"><tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Nome da Equipe</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Pontos</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Ações</th>
            </tr></thead>
            <tbody>
                {unitTeams.length > 0 ? unitTeams.map(team => (
                <tr key={team.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4 text-gray-900 dark:text-white font-medium">{team.nome}</td>
                    <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                            <button onClick={() => adjustPoints(team, -5)} className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white"><MinusIcon className="w-4 h-4" /></button>
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 w-12">{team.pontos}</span>
                            <button onClick={() => adjustPoints(team, 5)} className="p-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white"><PlusIcon className="w-4 h-4" /></button>
                        </div>
                    </td>
                    <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                        <button onClick={() => openCommentsModal(team)} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><CommentIcon /></button>
                        <button onClick={() => openEditTeamModal(team)} className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"><EditIcon /></button>
                        <button onClick={() => handleDeleteTeam(team.id)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"><DeleteIcon /></button>
                    </div>
                    </td>
                </tr>
                )) : ( <tr><td colSpan={3} className="text-center p-8 text-gray-500 dark:text-gray-400">Nenhuma equipe para esta unidade.</td></tr> )}
            </tbody>
            </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
                 <thead className="bg-gray-100 dark:bg-gray-700"><tr>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Confronto</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Descrição</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Ações</th>
                </tr></thead>
                <tbody>
                    {unitConfrontos.length > 0 ? unitConfrontos.map(c => (
                        <tr key={c.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4 text-gray-900 dark:text-white font-medium">
                                <span className="font-bold">{getTeamName(c.team1Id)}</span>
                                <span className="text-emerald-600 dark:text-emerald-400 mx-2">{c.team1Score} x {c.team2Score}</span>
                                <span className="font-bold">{getTeamName(c.team2Id)}</span>
                            </td>
                            <td className="p-4 text-gray-600 dark:text-gray-300">{c.description}</td>
                            <td className="p-4 text-center">
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => openEditConfrontoModal(c)} className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"><EditIcon /></button>
                                    <button onClick={() => handleDeleteConfronto(c.id)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"><DeleteIcon /></button>
                                </div>
                            </td>
                        </tr>
                    )) : (<tr><td colSpan={3} className="text-center p-8 text-gray-500 dark:text-gray-400">Nenhum confronto para esta unidade.</td></tr>)}
                </tbody>
            </table>
        </div>
      )}

      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} onSave={handleSaveTeam} team={editingTeam}/>
      <ConfrontoModal isOpen={isConfrontoModalOpen} onClose={() => setIsConfrontoModalOpen(false)} onSave={handleSaveConfronto} confronto={editingConfronto} teams={teams}/>
      <CommentsModal 
        isOpen={isCommentsModalOpen} 
        onClose={() => setIsCommentsModalOpen(false)} 
        team={selectedTeamForComments}
        comments={comments.filter(c => c.team_id === selectedTeamForComments?.id)}
        addComment={addComment}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default AdminPanel;
