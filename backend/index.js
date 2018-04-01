const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const apiKey = '';

app.use(cors());

app.get('/data', function (request, response) {
  const key = '?api_key=' + apiKey;
  const urlSummoner = 'https://eun1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + request.query.summonerName + key;
  axios.get(urlSummoner)
    .then(summonerResponse => {
      const summoner = summonerResponse.data;

      const urlLeague = 'https://eun1.api.riotgames.com/lol/league/v3/positions/by-summoner/' + summoner.id + key;
      axios.get(urlLeague)
        .then(leagueResponse => {
          const league = leagueResponse.data;
          const account = {summoner, league};

          const challengerLeaguesUrl = 'https://eun1.api.riotgames.com/lol/league/v3/challengerleagues/by-queue/RANKED_SOLO_5x5' + key;
          axios.get(challengerLeaguesUrl)
            .then(challengerLeaguesResponse => {
              const challengerleagues = challengerLeaguesResponse.data;
              response.json({ challengerleagues, account});
            }).catch(error => console.error(error));
        }).catch(error => console.error(error));
    }).catch(error => console.error(error));
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
