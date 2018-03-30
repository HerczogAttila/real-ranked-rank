import React from 'react';
import ReactQueryParams from 'react-query-params';

import axios from './axios';
import './App.css';

class App extends ReactQueryParams {
  state = {
    name: this.queryParams.name ? this.queryParams.name : '',
    data: null,
    range: 11,
    cheat: false
  }

  componentDidMount() {
    if (this.state.name) {
      this.searchHandler();
    }
  }

  searchHandler = () => {
    const name = this.state.name.toLowerCase();
    const url = '/data?summonerName=' + name;
    axios.get(url)
      .then(response => {
        const data = response.data;
        let cheat = false;
        if (data.challengerleagues && data.challengerleagues.entries) {
          data.challengerleagues.entries = data.challengerleagues.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
          const maxLeaguePoints = Math.max.apply(null, data.challengerleagues.entries.map(entry => entry.leaguePoints));
          if (data.account.league) {
            const league = data.account.league.find(s => s.queueType === 'RANKED_SOLO_5x5');
            if (league && !data.challengerleagues.entries.find(item => item.playerOrTeamName === data.account.summoner.name)) {
              cheat = true;
              data.challengerleagues.entries.unshift({ playerOrTeamId: data.account.summoner.id, playerOrTeamName: data.account.summoner.name, leaguePoints: maxLeaguePoints * 2, wins: league.wins, losses: league.losses });
            }
          }
        }
        this.setState({ data, cheat });
      }).catch(error => console.log(error));
  };

  nameChangedHandler = (event) => {
    this.setState({ name: event.target.value });
  };

  inputSearchHandler = (event) => {
    if (event.key === 'Enter') {
      this.searchHandler();
    }
  };

  render() {
    let appClass = 'App';
    let results = null;
    let message = null;
    if (this.state.data) {
      let personalData = null;
      let challengerleaguesData = null;
      if (this.state.data.challengerleagues && this.state.data.challengerleagues.entries) {
        const summoner = this.state.data.challengerleagues.entries.find(item => item.playerOrTeamName === this.state.data.account.summoner.name);
        const index = this.state.data.challengerleagues.entries.indexOf(summoner);
        const min = index >= 4 ? index - 5 : 0;
        let entries = this.state.data.challengerleagues.entries.slice(min, min + this.state.range);
        personalData = <div className='league-data-container'>
          <span>Name: {this.state.data.account.summoner.name}</span>
          <span>Level: {this.state.data.account.summoner.summonerLevel}</span>
          <span>League: UNRANKED</span>
        </div>;
        if (this.state.data.account.league) {
          const league = this.state.data.account.league.find(s => s.queueType === 'RANKED_SOLO_5x5');
          if (league) {
            personalData = <div className='league-data-container'>
              <span>Név: {this.state.data.account.summoner.name}</span>
              <span>Szint: {this.state.data.account.summoner.summonerLevel}</span>
              <span>Liga: {league.tier} {league.rank} ({league.leagueName})</span>
              <span>Pont: {league.leaguePoints}</span>
              <span>Győzelmek: {league.wins}</span>
              <span>Vereségek: {league.losses}</span>
            </div>;

            const entriesData = entries.map((entry, index) => (
              <tr key={entry.playerOrTeamId} className={entry.playerOrTeamName === this.state.data.account.summoner.name ? 'summoner' : ''}>
                <td>{index + min + 1}</td>
                <td className='summoner-name'>{entry.playerOrTeamName}</td>
                <td>{entry.leaguePoints}</td>
                <td>{entry.wins}</td>
                <td>{entry.losses}</td>
              </tr>
            ));
            challengerleaguesData = <div>
              <span>Valós liga: {this.state.data.challengerleagues.tier}</span>
              <table>
                <thead>
                  <tr>
                    <th>Helyezés</th>
                    <th>Név</th>
                    <th>LP</th>
                    <th>Győzelmek</th>
                    <th>Vereségek</th>
                  </tr>
                </thead>
                <tbody>
                  {entriesData}
                </tbody>
              </table>
            </div>;
          }
        }
      }

      let profileIcon = null;
      if (this.state.data.account && this.state.data.account.summoner) {
        profileIcon = <div className='profile-icon-container'>
          <img className='profile-icon' alt='' src={'http://ddragon.leagueoflegends.com/cdn/8.4.1/img/profileicon/' + this.state.data.account.summoner.profileIconId + '.png'} />
        </div>;
      }

      if (this.state.cheat && challengerleaguesData) {
        message = <div className='message-container'>
          <span>Remélem elégedett vagy a valós helyezéseddel!</span>
          <span>Ne felejtsd el megnézni a dátumot!</span>
        </div>;
      }

      results = <div className="result-container">
        {profileIcon}
        {personalData}
        {challengerleaguesData}
      </div>;
    } else {
      appClass += ' search';
    }

    return (
      <div className={appClass}>
        <h1>EUNE Valós Rangsorolt Helyezés</h1>
        <div className="search-container">
          <input placeholder="Idéző név" type="text" onKeyUp={this.inputSearchHandler} value={this.state.name} onChange={this.nameChangedHandler} />
          <button className="search-button" onClick={this.searchHandler}>Keresés</button>
        </div>
        {results}
        {message}
      </div>
    );
  }
}

export default App;
