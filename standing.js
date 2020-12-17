const cheerio = require('cheerio');
const axios = require('axios');
const db = require('./db');

db.connect();

(async () => {
    const res = await axios.get('http://www.cpbl.com.tw/standing/season/2020.html?&year=2020&season=0');
    const $ = cheerio(res.data);
    const teams = $.find('.gap_b20 table:nth-child(2) tbody tr:not(:first-child)');

    const trimSpace = (text) => {
      return text.trim()
    }

    const separateNumber = (num) => {
      return num.split('-')
    }
    
    const thisYearStanding = teams.map((i, data) => {
      const team = cheerio(data)

      return {
        rank: team.find('td:first-child').text(),
        team: trimSpace(team.find('td:nth-child(2)').text()),
        games: trimSpace(team.find('td:nth-child(3)').text()),
        win: separateNumber(team.find('td:nth-child(4)').text())[0],
        lose: separateNumber(team.find('td:nth-child(4)').text())[2],
        tied: separateNumber(team.find('td:nth-child(4)').text())[1],
        PCT: team.find('td:nth-child(5)').text(),
        gamesBehind: team.find('td:nth-child(6)').text(),
        eliminationNumber: team.find('td:nth-child(7)').text(),
        vsBrothers: team.find('td:nth-child(8)').text(),
        vsMonkeys: team.find('td:nth-child(9)').text(),
        vsLions: team.find('td:nth-child(10)').text(),
        vsGuardians: team.find('td:nth-child(11)').text(),
        home: team.find('td:nth-child(12)').text(),
        away: team.find('td:nth-child(13)').text(),
        currentStreak: team.find('td:nth-child(14)').text(),
        L10: team.find('td:last-child').text(),
      }
    }).get()

    for(let i=0; i<thisYearStanding.length; i++) {
      db.query(
        `INSERT INTO 
          test(team, games) 
        VALUES
          ('${thisYearStanding[i].team}', ${thisYearStanding[i].games})
        ON DUPLICATE KEY UPDATE
          games=${thisYearStanding[i].games}
        `, (error, results) => {
        if(error) throw error
        console.log('done', results)
      })
    }

    for(let i=0; i<thisYearStanding.length; i++) {
      console.log(thisYearStanding[i].team, thisYearStanding[i].games);
    }
})();
