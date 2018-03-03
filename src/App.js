import React from 'react';
import ReactQueryParams from 'react-query-params';

import axios from './axios';
import './App.css';

class App extends ReactQueryParams {
  state = {
    name: this.queryParams.name,
    data: null
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
        this.setState({ data: response.data });
      }).catch(error => console.log(error));
  };

  nameChangedHandler = (event) => {
    this.setState({ name: event.target.value });
  };

  render() {    
    let summonerData = null;
    let leagueData = null;
    let challengerleaguesData = null;
    if (this.state.data) {
      if (this.state.data.challengerleagues && this.state.data.challengerleagues.entries) {
        let entries = this.state.data.challengerleagues.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
        if (this.state.data.account.league) {
          const league = this.state.data.account.league.find(s => s.queueType === 'RANKED_SOLO_5x5');
          if (league) {
            leagueData = <div>
              <span>Name: {league.leagueName}</span>
              <span>Point: {league.leaguePoints}</span>
              <span>Wins: {league.wins}</span>
              <span>Losses: {league.losses}</span>
              <span>Tier: {league.tier}</span>
              <span>Rank: {league.rank}</span>
            </div>;

            const maxLeaguePoints = Math.max.apply(null, entries.map(entry => entry.leaguePoints));

            entries.unshift({ playerOrTeamId: this.state.data.account.summoner.id, playerOrTeamName: this.state.data.account.summoner.name, leaguePoints: maxLeaguePoints * 2, wins: league.wins, losses: league.losses });

          } else {
            leagueData = <div>Unranked</div>
          }
        } else {
          leagueData = <div>Unranked</div>
        }

        const entriesData = entries.map(entry => (
          <tr key={entry.playerOrTeamId}>
            <td>{entry.playerOrTeamName}</td>
            <td>{entry.leaguePoints}</td>
            <td>{entry.wins}</td>
            <td>{entry.losses}</td>
          </tr>
        ));
        challengerleaguesData = <div>
          <span>Name: {this.state.data.challengerleagues.name}</span>
          <span>Tier: {this.state.data.challengerleagues.tier}</span>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>LP</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {entriesData}
            </tbody>
          </table>
        </div>;
      }

      if (this.state.data.account && this.state.data.account.summoner) {
        summonerData = <div>
          <img alt='' src={'http://ddragon.leagueoflegends.com/cdn/8.4.1/img/profileicon/' + this.state.data.account.summoner.profileIconId + '.png'} />;
        <span>Name: {this.state.data.account.summoner.name}</span>
          <span>Level: {this.state.data.account.summoner.summonerLevel}</span>
        </div>;
      }
    }

    return (
      <div className="App">
        <input type="text" value={this.state.name} onChange={(event) => this.nameChangedHandler(event)} />
        <button onClick={this.searchHandler}>Search</button>
        {summonerData}
        {leagueData}
        {challengerleaguesData}
      </div>
    );
  }
}

export default App;
