const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
  for(let i=1; i<=6; i++) {
    const res = await axios.get(`http://www.cpbl.com.tw/stats/all.html?year=2020&game_type=01&stat=ppit&online=0&sort=WIN&order=desc&per_page=${i}`);
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
        GS: batter.find('td:nth-child(4)').text(),
        GR後援: batter.find('td:nth-child(5)').text(),
        CG: batter.find('td:nth-child(6)').text(),
        SHO: batter.find('td:nth-child(7)').text(),
        NBB: batter.find('td:nth-child(8)').text(),
        Win: batter.find('td:nth-child(9)').text(),
        Lose: batter.find('td:nth-child(10)').text(),
        SV: batter.find('td:nth-child(11)').text(),
        BS: batter.find('td:nth-child(12)').text(),
        HLD: batter.find('td:nth-child(13)').text(),
        IP: batter.find('td:nth-child(14)').text(),
        WHIP: batter.find('td:nth-child(15)').text(),
        ERA: batter.find('td:nth-child(16)').text(),
        BF面對打席: batter.find('td:nth-child(17)').text(),
        NP投球數: batter.find('td:nth-child(18)').text(),
        H: batter.find('td:nth-child(19)').text(),
        HR: batter.find('td:nth-child(20)').text(),
        BB: batter.find('td:nth-child(21)').text(),
        IBB: batter.find('td:nth-child(22)').text(),
        HBP: batter.find('td:nth-child(23)').text(),
        SO: batter.find('td:nth-child(24)').text(),
        WP: batter.find('td:nth-child(25)').text(),
        BK: batter.find('td:nth-child(26)').text(),
        R: batter.find('td:nth-child(27)').text(),
        ER: batter.find('td:nth-child(28)').text(),
        GO: batter.find('td:nth-child(29)').text(),
        AO: batter.find('td:nth-child(30)').text(),
        GOAO: batter.find('td:last-child').text(),
      }
    }).get()

    console.log(batterThisYearStats);
  }
})();