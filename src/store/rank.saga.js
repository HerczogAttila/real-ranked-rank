import { put } from 'redux-saga/effects';
import axios from "../axios";

import * as actions from './rank';

export function* getDataSaga(action) {
  try {
    const url = '/data?summonerName=' + action.name;
    const response = yield axios.get(url);

    const data = response.data;
    let cheat = false;
    if (data.challengerleagues && data.challengerleagues.entries) {
      data.challengerleagues.entries = data.challengerleagues.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
      const maxLeaguePoints = Math.max.apply(null, data.challengerleagues.entries.map(entry => entry.leaguePoints));
      if (data.account.league) {
        const league = data.account.league.find(s => s.queueType === 'RANKED_SOLO_5x5' || s.queueType === 'RANKED_FLEX_SR');
        if (league && !data.challengerleagues.entries.find(item => item.playerOrTeamName === data.account.summoner.name)) {
          cheat = true;
          data.challengerleagues.entries.unshift({ playerOrTeamId: data.account.summoner.id, playerOrTeamName: data.account.summoner.name, leaguePoints: maxLeaguePoints * 2, wins: league.wins, losses: league.losses });
        }
      }
    }

    yield put(actions.successGetData(data, cheat));
  } catch (error) {
    yield put(actions.failGetData(error));
  }
}
