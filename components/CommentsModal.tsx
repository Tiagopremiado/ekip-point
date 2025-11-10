import React, { useState } from 'react';
import { Team, TeamComment } from '../types';
import { CloseIcon, DeleteIcon, PlusIcon } from './Icons';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  comments: TeamComment[];
  addComment: (teamId: string, comment: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ isOpen, onClose, team, comments, addComment, deleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !team) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
        await addComment(team.id, newComment);
        setNewComment('');
    } catch (error) {
        console.error("Failed to add comment:", error);
        alert("Erro ao adicionar comentário.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm("Excluir este comentário?")) {
        try {
            await deleteComment(id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Erro ao excluir comentário.");
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col" style={{maxHeight: '90vh'}}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comentários - {team.nome}</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"><CloseIcon /></button>
          </div>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="flex items-start justify-between gap-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">{comment.comment}</p>
                <button 
                    onClick={() => handleDeleteComment(comment.id)} 
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex-shrink-0">
                    <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center italic">Nenhum comentário para esta equipe ainda.</p>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleAddComment} className="space-y-3">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adicionar Novo Comentário</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário aqui..."
              rows={3}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-700">Fechar</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2" disabled={isSubmitting}>
                <PlusIcon className="w-4 h-4"/> {isSubmitting ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
