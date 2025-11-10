import React, { useState, useEffect, useCallback } from 'react';
import { Team, Confronto, TeamComment } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import PublicView from './components/PublicView';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [confrontos, setConfrontos] = useState<Confronto[]>([]);
  const [comments, setComments] = useState<TeamComment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('pontos', { ascending: false });
      
      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      const { data: confrontosData, error: confrontosError } = await supabase
        .from('confrontos')
        .select('*')
        .order('date', { ascending: false });
      
      if (confrontosError) throw confrontosError;
      setConfrontos(confrontosData || []);

      const { data: commentsData, error: commentsError } = await supabase
        .from('team_comments')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (commentsError) throw commentsError;
      setComments(commentsData || []);
      
      const storedAdmin = sessionStorage.getItem('isAdmin');
      if (storedAdmin === 'true') {
        setIsAdmin(true);
      }
    } catch (err: any) {
      console.error("Failed to load data from Supabase", err);
      setError(`Falha ao carregar dados: ${err.message}. Verifique a configuração do Supabase e as políticas de RLS.`);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdminAccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('isAdmin', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };
  
  // Team CRUD
  const addTeam = async (team: Omit<Team, 'id'>) => {
    const { data, error } = await supabase.from('teams').insert(team).select();
    if (error) throw error;
    if (data) setTeams(prev => [...prev, data[0]]);
  };
  const updateTeam = async (updatedTeam: Team) => {
    // Fix: Destructure 'id' from the payload before sending the update request.
    const { id, ...teamData } = updatedTeam;
    const { data, error } = await supabase.from('teams').update(teamData).eq('id', updatedTeam.id).select();
    if (error) throw error;
    if (data) setTeams(prev => prev.map(t => t.id === updatedTeam.id ? data[0] : t));
  };
  const deleteTeam = async (id: string) => {
    // ON DELETE CASCADE no DB cuidará dos confrontos e comentários
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) throw error;
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  // Confronto CRUD
  const addConfronto = async (confronto: Omit<Confronto, 'id'>) => {
    const { data, error } = await supabase.from('confrontos').insert(confronto).select();
    if (error) throw error;
    if (data) setConfrontos(prev => [data[0], ...prev]);
  };
  const updateConfronto = async (updatedConfronto: Confronto) => {
    // Fix: Destructure 'id' from the payload before sending the update request.
    const { id, ...confrontoData } = updatedConfronto;
    const { data, error } = await supabase.from('confrontos').update(confrontoData).eq('id', updatedConfronto.id).select();
    if (error) throw error;
    if (data) setConfrontos(prev => prev.map(c => c.id === updatedConfronto.id ? data[0] : c));
  };
  const deleteConfronto = async (id: string) => {
    const { error } = await supabase.from('confrontos').delete().eq('id', id);
    if (error) throw error;
    setConfrontos(prev => prev.filter(c => c.id !== id));
  };
  
  // Comment CRUD
  const addComment = async (teamId: string, comment: string) => {
      const { data, error } = await supabase.from('team_comments').insert({ team_id: teamId, comment: comment }).select();
      if (error) throw error;
      if (data) setComments(prev => [...prev, data[0]]);
  }
  const deleteComment = async (commentId: string) => {
      const { error } = await supabase.from('team_comments').delete().eq('id', commentId);
      if (error) throw error;
      setComments(prev => prev.filter(c => c.id !== commentId));
  }


  if (error) {
    return <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 text-center p-4">{error}</div>
  }
  if(!isLoaded) {
    return <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center text-gray-800 dark:text-white text-xl">Carregando dados...</div>
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {isAdmin ? (
          <AdminPanel 
            teams={teams}
            confrontos={confrontos}
            comments={comments}
            addTeam={addTeam}
            updateTeam={updateTeam}
            deleteTeam={deleteTeam}
            addConfronto={addConfronto}
            updateConfronto={updateConfronto}
            deleteConfronto={deleteConfronto}
            addComment={addComment}
            deleteComment={deleteComment}
            onLogout={handleLogout}
          />
        ) : (
          <PublicView teams={teams} confrontos={confrontos} comments={comments} />
        )}
      </main>
      <Footer onAdminAccess={handleAdminAccess} />
    </div>
  );
};

export default App;
