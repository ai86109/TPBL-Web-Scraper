const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
  for(let i=1; i<=6; i++) {
    const res = await axios.get(`http://www.cpbl.com.tw/stats/all.html?year=2020&game_type=01&stat=pbat&online=0&sort=G&order=desc&per_page=${i}`);
    const $ = cheerio(res.data);
    const batters = $.find('.gap_b20 table tbody tr:not(:first-child)');

    const teamMap = {
      'B04': '富邦悍將',
      'AJL011': 'Rakuten Monkeys',
      'L01': '統一7-ELEVEn獅',
      'E02': '中信兄弟',
    };

    const separatePlayerInfo = (info) => {
      const playerInfo = info.trim()
      const playerInfoArr = playerInfo.split(' ')

      if(playerInfoArr.length > 2) {
        let terminatePlayerInfo, rest
        [terminatePlayerInfo, ...rest] = playerInfoArr
        return rest
      }

      return playerInfoArr
    }

    const parseTeamId = (imgEl) => {
      const src = imgEl.attr('src');

      return src.replace(/^.*\/(\w+)_logo_01\.png/, '$1');
    }
    
    if(!batters) return
    const batterThisYearStats = batters.map((i, data) => {
      const batter = cheerio(data)

      return {
        rank: batter.find('td:first-child').text(),
        team: teamMap[parseTeamId(batter.find('td:nth-child(2) img'))],
        playerNumber: separatePlayerInfo(batter.find('td:nth-child(2)').text())[0],
        playerName: separatePlayerInfo(batter.find('td:nth-child(2)').text())[1],
        games: batter.find('td:nth-child(3)').text(),
        PA: batter.find('td:nth-child(4)').text(),
        AB: batter.find('td:nth-child(5)').text(),
        RBI: batter.find('td:nth-child(6)').text(),
        R: batter.find('td:nth-child(7)').text(),
        H: batter.find('td:nth-child(8)').text(),
        _1B: batter.find('td:nth-child(9)').text(),
        _2B: batter.find('td:nth-child(10)').text(),
        _3B: batter.find('td:nth-child(11)').text(),
        HR: batter.find('td:nth-child(12)').text(),
        TB: batter.find('td:nth-child(13)').text(),
        SO: batter.find('td:nth-child(14)').text(),
        SB: batter.find('td:nth-child(15)').text(),
        OBP: batter.find('td:nth-child(16)').text(),
        SLG: batter.find('td:nth-child(17)').text(),
        AVG: batter.find('td:nth-child(18)').text(),
        GIDP: batter.find('td:nth-child(19)').text(),
        SAC: batter.find('td:nth-child(20)').text(),
        SF: batter.find('td:nth-child(21)').text(),
        BB: batter.find('td:nth-child(22)').text(),
        IBB: batter.find('td:nth-child(23)').text(),
        HBP: batter.find('td:nth-child(24)').text(),
        CS: batter.find('td:nth-child(25)').text(),
        GO: batter.find('td:nth-child(26)').text(),
        AO: batter.find('td:nth-child(27)').text(),
        GOAO: batter.find('td:nth-child(28)').text(),
        SB: batter.find('td:nth-child(29)').text(),
        TA: batter.find('td:nth-child(30)').text(),
        SSA: batter.find('td:last-child').text(),
      }
    }).get()

    console.log(batterThisYearStats);
  }
})();