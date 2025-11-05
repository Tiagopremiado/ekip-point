
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            {/* Light mode logo */}
            <img src="https://i.imgur.com/GqGhkov.png" alt="FOPE CIA 126 Logo" className="h-14 w-auto dark:hidden" />
            {/* Dark mode logo */}
            <img src="https://i.imgur.com/er6X2N8.png" alt="FOPE CIA 126 Logo" className="h-14 w-auto hidden dark:block" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white ml-3 tracking-tight">
              FOPE CIA 126 - Dinâmica de Equipes
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
