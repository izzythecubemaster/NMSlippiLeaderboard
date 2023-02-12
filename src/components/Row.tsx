import React from 'react';
import { Player } from '../lib/player'
import { getRank } from '../lib/ranks'
import { Characters } from './Characters'

interface Props {
  player: Player
}

// Custom names override what the Slippi API has
// I put the option here for names that were inputted on the google form.
const customNames = {
  "TEQU#973": "Mrfundamentals", 
  "IZZY#756": "Fuzzy",
  "MINW#207": "Minwu",
  "POTA#710": "zains bussy",    
  "ZAVI#614": "SnakeManJohnson",
  "QQ#230": "See Biscuit",      
  "TOMM#257": "Goose",
  "CHIL#539": "Shortbutlong/Ironwood/Chillestbread",
  "LINK#777": "NintaiLink",
  "CANA#607": "Canary",
  "NOC#0": "Noc",
  "YHO#485": "yho",
  "NOTP#148": "NotPIMP",
  "TOXC#557": "ToxicStar_10094",
  "STER#536": "Ster",
  "USAI#439": "Usainkrot",
  "APUE#423": "Strat",
  "REID#217": "Reidd",
};

export function Row({ player }: Props) {
  let names = [player.displayName];
  if (customNames.hasOwnProperty(player.connectCode.code)) {
      let customName = customNames[player.connectCode.code];
      names = customName.split('/');
  }

  const codeToId = (code: string) => {
    const parts = code.split('#')
    return `${parts[0].toLowerCase()}-${parts[1]}`
  }

  const codeToUrlSlug = (code: string) => {
    return `https://slippi.gg/user/${codeToId(code)}` 
  }

  const changeIndicator = (change: number, indicators: string[]) => {
    return <span className={`px-1 md:text-sm text-xs ${change > 0 ? 'text-green-500': 'text-red-500'}`}>
     {change > 0? indicators[0]: indicators[1]}{Math.abs(change)}
   </span>
  }

  const changeArrow = (change: number) => {
    return changeIndicator(change, ['▲ ', '▼ '])

  }

  const changePlusMinus = (change: number) => {
    return changeIndicator(change, ['+', '-'])
  }

  const getRankChange = (player: Player) => {
    if (!player.oldRankedNetplayProfile || !player.oldRankedNetplayProfile.rank) {
      return null;
    }
    return player.oldRankedNetplayProfile.rank - player.rankedNetplayProfile.rank;
  }

  const getRatingChange = (player: Player) => {
    if (!player.oldRankedNetplayProfile || !player.oldRankedNetplayProfile.ratingOrdinal) {
      return null;
    }
    return Math.floor(player.rankedNetplayProfile.ratingOrdinal - player.oldRankedNetplayProfile.ratingOrdinal);
  }

  const playerRank = getRank(player);
  const isActive = playerRank.name !== 'None';
  const totalSets = player.rankedNetplayProfile.wins + player.rankedNetplayProfile.losses;
  const totalGames = player.rankedNetplayProfile.characters.reduce((acc, val)=> acc + val.gameCount, 0);
  const rankChange = getRankChange(player);
  const ratingChange = getRatingChange(player);

  return (
    <tr className={`${playerRank.bgClass} border-separate border-spacing-2 border-b-2 border-gray-600`} >
      <td className="md:text-2xl text-gray-300 md:px-6 md:py-4 md:p-1 whitespace-nowrap">
        <div>{isActive && `#${player.rankedNetplayProfile.rank}`}</div>
        {Boolean(rankChange) && changeArrow(rankChange)} </td>
      <td className="text-gray-100 md:px-6 md:py-4 p-1 whitespace-nowrap text-center overflow-hidden md:max-w-full max-w-[7rem] text-elipses">
        <a className="md:text-xl text-sm max-w-xs text-gray-300 hover:text-gray-500 hover:underline" href={codeToUrlSlug(player.connectCode.code)}>
          {
            names.map((name) =>
              <p key={`uname_${name}`}>{name}</p>
            )
          }
        </a>
        <div className="text-gray-300 text-xs">{player.connectCode.code}</div>
      </td>
      <td className="md:text-xl text-sm text-gray-900 md:px-6 md:py-4 p-1 whitespace-nowrap text-center">

        {playerRank.iconUrl && <div className="flex items-center justify-center">
          <img className="md:h-10 md:w-10 h-6 w-6 drop-shadow" src={playerRank.iconUrl} />
        </div>}
        <div className="md:text-lg text-xs max-w-xs text-gray-300 uppercase">
          {playerRank.name}
        </div>
        <div className="text-gray-300 md:text-sm text-xs">
          {isActive && Math.floor(player.rankedNetplayProfile.ratingOrdinal)}
          {isActive && Boolean(ratingChange) && changePlusMinus(ratingChange)}
        </div>
      </td>
      <td className="md:text-sm text-xs text-gray-300 md:px-6 md:py-4 py-1  md:max-w-[18rem] max-w-[3rem]">
        <Characters player={player} totalGames={totalGames} />
      </td>
      <td className="md:text-xl text-gray-300 text-sm md:px-6 md:py-4 md:p-1 whitespace-nowrap">
        {Boolean(totalGames) && <><span className="text-green-500">{player.rankedNetplayProfile.wins ?? 0}</span><span className="md:p-1">/</span>
        <span className="text-red-500">{player.rankedNetplayProfile.losses ?? 0}</span>
      </>}
      </td>
    </tr>
  );
}
