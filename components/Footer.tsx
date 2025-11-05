
import React, { useState } from 'react';
import { ADMIN_ACCESS_CODE } from '../constants';

interface FooterProps {
  onAdminAccess: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminAccess }) => {
  const [showInput, setShowInput] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const handleAccessAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === ADMIN_ACCESS_CODE) {
      onAdminAccess();
      setShowInput(false);
      setAccessCode('');
    } else {
      alert('Código inválido.');
      setAccessCode('');
    }
  };

  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Acesso Resp...
          </button>
        ) : (
          <form onSubmit={handleAccessAttempt} className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Código de Acesso"
              className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full sm:w-auto"
            >
              Entrar
            </button>
             <button
              type="button"
              onClick={() => setShowInput(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full sm:w-auto"
            >
              Cancelar
            </button>
          </form>
        )}
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} FOPE CIA 126. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
