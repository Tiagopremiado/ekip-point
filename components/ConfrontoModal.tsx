import React, { useState, useEffect, useMemo } from 'react';
import { Confronto, Team, Unit } from '../types';
import { CloseIcon } from './Icons';

interface ConfrontoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (confronto: Omit<Confronto, 'id'> | Confronto) => void;
  confronto: Confronto | null;
  teams: Team[];
}

const ConfrontoModal: React.FC<ConfrontoModalProps> = ({ isOpen, onClose, onSave, confronto, teams }) => {
  const [formData, setFormData] = useState<Omit<Confronto, 'id' | 'unidade'>>({
    team1Id: '',
    team2Id: '',
    team1Score: 0,
    team2Score: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [unidade, setUnidade] = useState<Unit>('Pelotas');

  const availableTeams = useMemo(() => {
    return teams.filter(t => t.unidade === unidade);
  }, [teams, unidade]);

  useEffect(() => {
    if (confronto) {
        setUnidade(confronto.unidade);
        setFormData({
            team1Id: confronto.team1Id,
            team2Id: confronto.team2Id,
            team1Score: confronto.team1Score,
            team2Score: confronto.team2Score,
            date: confronto.date,
            description: confronto.description,
        });
    } else {
        setUnidade('Pelotas');
        setFormData({
            team1Id: '', team2Id: '',
            team1Score: 0, team2Score: 0,
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
    }
  }, [confronto, isOpen]);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: (name.includes('Score')) ? parseInt(value) || 0 : value }));
  };

  const handleSave = () => {
    if (!formData.team1Id || !formData.team2Id || !formData.description) {
        alert("Preencha todos os campos obrigatórios (Equipes e Descrição).");
        return;
    }
    if (formData.team1Id === formData.team2Id) {
        alert("Uma equipe não pode jogar contra si mesma.");
        return;
    }

    const dataToSave = { ...formData, unidade };
    onSave(confronto ? { ...dataToSave, id: confronto.id } : dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{confronto ? 'Editar Confronto' : 'Novo Confronto'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
          </div>
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-300">Unidade</label>
                <select value={unidade} onChange={e => {setUnidade(e.target.value as Unit); setFormData(f => ({...f, team1Id: '', team2Id: ''}))}} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500">
                  <option>Pelotas</option>
                  <option>Pedro Osório</option>
                </select>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Equipe 1</label>
                    <select name="team1Id" value={formData.team1Id} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500">
                      <option value="">Selecione...</option>
                      {availableTeams.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Placar Equipe 1</label>
                    <input type="number" name="team1Score" value={formData.team1Score} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Equipe 2</label>
                    <select name="team2Id" value={formData.team2Id} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500">
                      <option value="">Selecione...</option>
                      {availableTeams.filter(t => t.id !== formData.team1Id).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Placar Equipe 2</label>
                    <input type="number" name="team2Score" value={formData.team2Score} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Descrição da Atividade</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-300">Data</label>
                 <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfrontoModal;
