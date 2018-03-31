import React from 'react';
import ReactQueryParams from 'react-query-params';
import { connect } from 'react-redux';
import * as actions from './store/rank';

import './App.css';

class App extends ReactQueryParams {
  state = {
    name: this.queryParams.name ? this.queryParams.name : '',
    range: 11
  }

  componentDidMount() {
    if (this.state.name) {
      this.searchHandler();
    }
  }

  searchHandler = () => {
    this.props.onSearch(this.state.name);
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
    if (this.props.data) {
      let personalData = null;
      let challengerleaguesData = null;
      if (this.props.data.challengerleagues && this.props.data.challengerleagues.entries) {
        const summoner = this.props.data.challengerleagues.entries.find(item => item.playerOrTeamName === this.props.data.account.summoner.name);
        const index = this.props.data.challengerleagues.entries.indexOf(summoner);
        const min = index >= 4 ? index - 5 : 0;
        let entries = this.props.data.challengerleagues.entries.slice(min, min + this.state.range);
        personalData = <div className='league-data-container'>
          <span>Name: {this.props.data.account.summoner.name}</span>
          <span>Level: {this.props.data.account.summoner.summonerLevel}</span>
          <span>League: UNRANKED</span>
        </div>;
        if (this.props.data.account.league) {
          const league = this.props.data.account.league.find(s => s.queueType === 'RANKED_SOLO_5x5');
          if (league) {
            personalData = <div className='league-data-container'>
              <span>Név: {this.props.data.account.summoner.name}</span>
              <span>Szint: {this.props.data.account.summoner.summonerLevel}</span>
              <span>Liga: {league.tier} {league.rank} ({league.leagueName})</span>
              <span>Pont: {league.leaguePoints}</span>
              <span>Győzelmek: {league.wins}</span>
              <span>Vereségek: {league.losses}</span>
            </div>;

            const entriesData = entries.map((entry, index) => (
              <tr key={entry.playerOrTeamId} className={entry.playerOrTeamName === this.props.data.account.summoner.name ? 'summoner' : ''}>
                <td>{index + min + 1}</td>
                <td className='summoner-name'>{entry.playerOrTeamName}</td>
                <td>{entry.leaguePoints}</td>
                <td>{entry.wins}</td>
                <td>{entry.losses}</td>
              </tr>
            ));
            challengerleaguesData = <div>
              <span>Valós liga: {this.props.data.challengerleagues.tier}</span>
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
      if (this.props.data.account && this.props.data.account.summoner) {
        profileIcon = <div className='profile-icon-container'>
          <img className='profile-icon' alt='' src={'https://ddragon.leagueoflegends.com/cdn/8.4.1/img/profileicon/' + this.props.data.account.summoner.profileIconId + '.png'} />
        </div>;
      }

      if (this.props.cheat && challengerleaguesData) {
        message = <div className='message-container'>
          <span>Remélem elégedett vagy a valós helyezéseddel!</span>
          <span className='hidden'>Ne felejtsd el megnézni a dátumot!</span>
        </div>;
      }

      results = <div className="result-container">
        {profileIcon}
        {personalData}
        {challengerleaguesData}
      </div>;
    }

    if (!this.props.isLoading && !this.props.data) {
      appClass += ' search';
    }

    let spinner = null;
    if (this.props.isLoading) {
      spinner = <div className="loader"></div>;
    }

    return (
      <div className={appClass}>
        <h1>EUNE Valós Rangsorolt Helyezés</h1>
        <div className="search-container">
          <input placeholder="Idéző név" type="text" onKeyUp={this.inputSearchHandler} value={this.state.name} onChange={this.nameChangedHandler} />
          <button className="search-button" onClick={this.searchHandler}>Keresés</button>
        </div>
        {spinner}
        {results}
        {message}
      </div>
    );
  }
}

const mapPropsToDispatch = state => {
  return {
    isLoading: state.rank.isLoading,
    error: state.rank.error,
    data: state.rank.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSearch: (name) => dispatch(actions.startGetData(name))
  };
};

export default connect(mapPropsToDispatch, mapDispatchToProps)(App);
