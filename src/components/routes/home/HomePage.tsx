import React, { useEffect, useState } from 'react';
import { Table } from '../../Table';
import { Player } from '../../../lib/player'
import playersOld from '../../../../cron/data/players-old.json';
import playersNew from '../../../../cron/data/players-new.json';
import timestamp from '../../../../cron/data/timestamp.json';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
import * as settings from '../../../../settings'
dayjs.extend(relativeTime)

import './homepage.module.scss';
import NMSlippiIcon from '../../../../images/home/nm-slippi-ranked.png';

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
    <div className="leaderboard">
      <h1 className="header">
        <img className="slippi-icon" src={NMSlippiIcon} />
        {settings.title}
      </h1>
      <div className="last-updated"> Updated {updateDesc}</div>
      <Table players={players} />
      <div className="credits">
        <p>
          <a href="https://github.com/izzythecubemaster/NMSlippiLeaderboard" target="_blank" rel="noreferrer"
              className="link">
            NMSlippiLeaderboard
          </a>
          {' '}is a fork of{' '}
          <a href="https://github.com/Grantismo/CoSlippiLeaderboard" target="_blank" rel="noreferrer"
              className="link">
            CoSlippiLeaderboard
          </a>
          {' '}built by blorppppp, if you can please{' '}
          <a href="https://www.buymeacoffee.com/blorppppp" target="_blank" rel="noreferrer"
              className="link">
            buy them a coffee
          </a>☕
        </p>
      </div>
    </div>
  );
}
