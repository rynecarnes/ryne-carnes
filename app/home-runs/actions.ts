'use server';

import { Game } from '@/models/game';
import { HomeRun } from '@/models/homerun';
import MLBStatsAPI from 'mlb-stats-api';

export async function fetchHomeRunData(date: string) {
  const mlbStats = new MLBStatsAPI();
  let games: Game[] = [];

  try {
    const schedule = await mlbStats.getSchedule({
      params: {
        sportId: 1,
        date: date
      }
    });

    const gamesPks: any[] = schedule.data.dates[0].games.map((game: { gamePk: any; }) => game.gamePk);

    const game = await mlbStats.getGameFeed({
      pathParams: {
        gamePk: gamesPks[0]
      }
    });

    for (const gamePk of gamesPks) {
      let game: Game = new Game();
      const gameFeed = await mlbStats.getGameFeed({
        pathParams: {
          gamePk: gamePk
        }
      });

      for (const play of gameFeed.data.liveData.plays.scoringPlays) {
        if (gameFeed.data.liveData.plays.allPlays[play].result.event === 'Home Run') {
          if (game.homeTeam === null) {
            game.homeTeam = gameFeed.data.gameData.teams.home.name;
            game.awayTeam = gameFeed.data.gameData.teams.away.name;
          }

          let description = gameFeed.data.liveData.plays.allPlays[play].result.description;
          let playerId = gameFeed.data.liveData.plays.allPlays[play].matchup.batter.id;

          // This will correctly pause the loop until the API responds
          const player = await mlbStats.getPerson({
            pathParams: { personId: playerId },
            params: { hydrate: "currentTeam" }
          });

          // Note: mlb-stats-api returns people as an array (player.data.people[0])
          let playerName = player.data.people[0].fullName;
          let playerTeam = player.data.people[0].currentTeam?.name || "Unknown";

          let hr = new HomeRun(playerName, playerTeam, description);
          game.homeRuns.push(hr);
        }
      }
      if (game.homeTeam !== null) {
        games.push(game);
      }
    }

    return {
      games: JSON.parse(JSON.stringify(games))
    };
  } catch (error) {
    console.error("MLB API Error:", error);
    throw new Error('Failed to fetch data');
  }
}
