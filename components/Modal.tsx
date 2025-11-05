import React, { useState, useEffect } from 'react';
import { Team, Unit } from '../types';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Omit<Team, 'id' | 'pontos'> | Team) => void;
  team: Team | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, team }) => {
  const [formData, setFormData] = useState({
    nome: '',
    unidade: 'Pelotas' as Unit,
    descricao: '',
    foPositivos: '',
    foNegativos: '',
    fotoUrl: ''
  });
  
  useEffect(() => {
    if (team) {
      setFormData({
        nome: team.nome,
        unidade: team.unidade,
        descricao: team.descricao,
        foPositivos: team.foPositivos.join('\n'),
        foNegativos: team.foNegativos.join('\n'),
        fotoUrl: team.fotoUrl || ''
      });
    } else {
      setFormData({
        nome: '',
        unidade: 'Pelotas' as Unit,
        descricao: '',
        foPositivos: '',
        foNegativos: '',
        fotoUrl: ''
      });
    }
  }, [team, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.nome || !formData.descricao) {
      alert("Nome e descrição são obrigatórios.");
      return;
    }

    const dataToSave = {
      ...formData,
      pontos: team?.pontos ?? 0,
      foPositivos: formData.foPositivos.split('\n').filter(Boolean),
      foNegativos: formData.foNegativos.split('\n').filter(Boolean)
    };
    
    onSave(team ? { ...dataToSave, id: team.id } : dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{team ? 'Editar Equipe' : 'Nova Equipe'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nome da Equipe</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">URL da Foto</label>
              <input type="text" name="fotoUrl" placeholder="https://exemplo.com/imagem.png" value={formData.fotoUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Unidade</label>
              <select name="unidade" value={formData.unidade} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500">
                <option>Pelotas</option>
                <option>Pedro Osório</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Descrição/Objetivo</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={2} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">F.O+ (um por linha)</label>
              <textarea name="foPositivos" value={formData.foPositivos} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">F.O- (um por linha)</label>
              <textarea name="foNegativos" value={formData.foNegativos} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-emerald-500" />
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

export default Modal;