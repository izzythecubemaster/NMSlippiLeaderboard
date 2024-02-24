import React, { useEffect, useState } from 'react';
import { getPlayerDataThrottled } from '../../../lib/slippi';
import { Table } from '../../Table';
import { Player } from '../../../lib/player'
import timestamp from '../../../../cron/data/timestamp.json';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
import * as settings from '../../../../settings'
dayjs.extend(relativeTime)

import playerCodes from '../../../../config/playercodes.json';

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
  const {"player_codes": codes} = playerCodes;
  const futureLength = codes.length;

  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    async function getPlayers() {
      // console.log(`Found ${codes.length} player codes`)
      const allData = codes.map(code => getPlayerDataThrottled(code));
      const results = await Promise.all(allData.map(p => p.catch(e => e)));
      const validResults = results.filter(result => !(result instanceof Error));
      const unsortedPlayers = validResults
        .filter((data: any) => data?.data?.getConnectCode?.user)
        .map((data: any) => data.data.getConnectCode.user);
      const finalResults = unsortedPlayers.sort((p1, p2) =>
        p2.rankedNetplayProfile.ratingOrdinal - p1.rankedNetplayProfile.ratingOrdinal)
      setCurrentPlayers(sortAndPopulatePlayers(finalResults));
      setIsUpdated(true);
    }
    if (!isUpdated) {
      getPlayers();
    }
  }, []);

  return (
    <div className="leaderboard">
      <h1 className="header">
        <img className="slippi-icon" src={NMSlippiIcon} />
        {settings.title}
      </h1>
      <Table players={currentPlayers} futureLength={futureLength} />
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
