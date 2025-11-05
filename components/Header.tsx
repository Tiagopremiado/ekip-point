
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.789-2.75 9.562-1.74-2.773-2.75-6.045-2.75-9.562C6.5 7.019 8.982 4 12 4s5.5 3.019 5.5 7.118zM12 11V4m0 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-white ml-3 tracking-tight">
              FOPE CIA 126 - Dinâmica de Equipes
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
