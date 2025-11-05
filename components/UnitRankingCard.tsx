import React from 'react';

interface UnitRankingCardProps {
  pelotasScore: number;
  pedroOsorioScore: number;
}

const UnitRankingCard: React.FC<UnitRankingCardProps> = ({ pelotasScore, pedroOsorioScore }) => {
  const pelotasWins = pelotasScore > pedroOsorioScore;
  const osorioWins = pedroOsorioScore > pelotasScore;
  const tie = pelotasScore === pedroOsorioScore;

  const getWinnerClass = (isWinner: boolean, isTie: boolean) => {
    if (isTie) return 'text-gray-300';
    if (isWinner) return 'text-emerald-400';
    return 'text-red-400';
  }

  return (
    <div className="col-span-full flex justify-center">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl border border-gray-700">
        <h3 className="text-center text-3xl font-extrabold text-white mb-8 tracking-wider">
          Placar Geral das Unidades
        </h3>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-200">Pelotas</h4>
            <p className={`text-6xl font-black mt-2 ${getWinnerClass(pelotasWins, tie)}`}>
              {pelotasScore}
            </p>
          </div>
          <div className="text-5xl font-thin text-gray-500 mx-6">
            VS
          </div>
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-200">Pedro Osório</h4>
            <p className={`text-6xl font-black mt-2 ${getWinnerClass(osorioWins, tie)}`}>
              {pedroOsorioScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitRankingCard;