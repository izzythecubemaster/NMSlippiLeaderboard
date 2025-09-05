import React, { useEffect, useState } from 'react';
import { Table } from '../../Table';
import { Player } from '../../../lib/player'
import playersOld from '../../../../cron/data/players-old.json';
import playersNew from '../../../../cron/data/players-new.json';
import timestamp from '../../../../cron/data/timestamp.json';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
import * as settings from '../../../../settings'
import NMFlag from '../../../../images/nm-slippi-ranked.png';
import './homepage.module.scss';
dayjs.extend(relativeTime)


const setCount = (player: Player) => {
  return player.rankedNetplayProfile.wins +
    player.rankedNetplayProfile.losses;
}

const sortAndPopulatePlayers = (players: Player[]) => {
  players = players.filter((p)=> setCount(p))
    .concat(players.filter((p)=> !setCount(p)));
  players.forEach((player: Player, i: number) => {
    if(setCount(player) > 0) {
      player.rankedNetplayProfile.rank = i + 1
    }
  })
  return players
}

export default function HomePage() {
  console.log(playersNew);
  console.log(playersOld);

  const rankedPlayersOld = sortAndPopulatePlayers(playersOld)
  const oldPlayersMap = new Map(
    rankedPlayersOld.map((p) => [p.connectCode.code, p]));
  
  const players = sortAndPopulatePlayers(playersNew);
  players.forEach((p) => {
    const oldData = oldPlayersMap.get(p.connectCode.code)
    if(oldData) {
      p.oldRankedNetplayProfile = oldData.rankedNetplayProfile
    }
  })

  // continuously update
  const updatedAt = dayjs(timestamp.updated);
  const [updateDesc, setUpdateDesc] = useState(updatedAt.fromNow())
  useEffect(() => {
    const interval = setInterval(
      () => setUpdateDesc(updatedAt.fromNow()), 1000*60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-8">
      <img className="slippi-icon" src={NMFlag} alt="new mexico flag" />
      <h1 className="text-3xl m-4 text-center text-white">
        {settings.title}
      </h1>
      <div className="p-1 text-gray-300"> Updated {updateDesc}</div>
      <Table players={players} />
      <div className="credits">
        <p>
          <a href="https://github.com/izzythecubemaster/NMSlippiLeaderboard" target="_blank" rel="noreferrer"
              className="link">
            NMSlippiLeaderboard
          </a>
          {' '}modified by izzythecubemaster is a fork of{' '}
          <a href="https://github.com/Grantismo/CoSlippiLeaderboard" target="_blank" rel="noreferrer"
              className="link">
            CoSlippiLeaderboard
          </a>
          {' '}built by blorppppp
        </p>
      </div>
    </div>
  );
}
