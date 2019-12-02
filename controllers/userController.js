var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const PLAYERS_MODEL = require('../models/playersSchema.js').schema;
const COUNTRIES_MODEL = require('../models/countriesSchema.js').schema;
const PLATFORMS_MODEL = require('../models/platformsSchema.js').schema;
const USER_MODEL = require('../models/userSchema.js').schema;
const ROLES_MODEL = require('../models/rolesSchema.js').schema;

function fill(){
    var file = "file://C:/players.txt"
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var lines  = allText.split("\n");
                var insert = true;
                var players = [];
                for (var i = 1; i < lines.length; i++) {
                    var cols = lines[i].split("\t");
                    var name = cols[0];
                    var elo = cols[1];
                    var wins = cols[3] != '' ? cols[3] : 0;
                    var lose = cols[4] != '' ? cols[4] : 0;
                    var total = cols[5] != '' ? cols[5] : 0;

                    var coll = {
                        name: name,
                        wins: wins,
                        losses: lose,
                        elo: elo,
                        games_played: total
                    }
                    PLAYERS_MODEL.findAndUpdate({"name":name}, coll);
                }
                console.log(PLAYERS_MODEL.insertMany(players));
            }
        }
    }
    rawFile.send(null);
}

module.exports = {
    fill
}