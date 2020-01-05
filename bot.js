const mongoose = require('mongoose');
const config = require('./config.js');

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });

var Discord = require('discord.io');
var auth = require('./auth.json');
const USER_MODEL = require('./models/userSchema.js').schema;
const PLAYERS_MODEL = require('./models/playersSchema.js').schema;
const COUNTRIES_MODEL = require('./models/countriesSchema.js').schema;
const PLATFORMS_MODEL = require('./models/platformsSchema.js').schema;
const ROLES_MODEL = require('./models/rolesSchema.js').schema;
const MATCHMAKING_MODEL = require('./models/matchmakingSchema.js').schema;
const MATCHMAKING_HISTORY_MODEL = require('./models/matchmakingHistorySchema.js').schema;
const DECLARE_MATCHES_MODEL = require('./models/declareMatchesSchema.js').schema;
const MATCH_FINISH_MODEL = require('./models/matchFinishSchema.js').schema;

//var uri = "mongodb://g_herrera:"+auth.mongo+"@flavoured-classics-shard-00-00-dmotk.mongodb.net:27017,flavoured-classics-shard-00-01-dmotk.mongodb.net:27017,flavoured-classics-shard-00-02-dmotk.mongodb.net:27017/test?ssl=true&replicaSet=Flavoured-Classics-shard-0&authSource=admin&retryWrites=true&w=majority";
const uri = "mongodb+srv://g_herrera:"+auth.mongo+"@flavoured-classics-dmotk.mongodb.net/URM_collection?retryWrites=true&w=majority";

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

const FUNCTION = 0;
const USERS_COLLECTION = "users";
const COUNTRIES_COLLECTION = "countries";
const DECLARE_MATCHES_COLLECTION = "declare_matches";
const MATCHMAKING_COLLECTION = "matchmaking";
const MATCHMAKING_HISTORY_COLLECTION = "history";
const PLATFORMS_COLLECTION = "platforms";
const PLAYERS_COLLECTION = "players";
const ROLES_COLLECTION = "roles";
const MATCH_FINISH_COLLECTION = "match_finish";

//regPlayer constants
const PREFIX_REGISTER_PLAYER = "regPlayer";
const REGISTER_TAG_POSITION = 1;
const REGISTER_NAME_POSITION = 2;
const REGISTER_COUNTRY_CODE_POSITION = 3;
const REGISTER_PLATFORM_POSITION = 4;
const REGISTER_HOURS_POSITION = 5;

//register constants
const PREFIX_REGISTER = "register";
const REGISTER_ROLE_POSITION = 2;

//regCountry constants
const PREFIX_REGISTER_COUNTRY = "regCountry";
const COUNTRY_NAME = 1;
const COUNTRY_CODE = 2;

//regPlatform constants
const PREFIX_REGISTER_PLATFORM = "regPlatform";
const PLATFORM_NAME = 1;
const PLATFORM_CODE = 2;

//matchmaking constants
const PREFIX_MATCHMAKE = "matchmake";

//matchend constants
const PREFIX_MATCH_END = "end-match";

//match declare constants
const PREFIX_MATCH_DECLARE = "challenge";

//match accept constants
const PREFIX_ACCEPT_MATCH = "accept";

//list constants
const PREFIX_LIST = "list";

const PREFIX_PROFILE = "profile";

//temporary constant
const PREFIX_RATING = "rating";

//middleware constants
var MIDDLEWARE = [
    /*admins*/      [PREFIX_RATING,
                        PREFIX_MATCH_END,
                        PREFIX_LIST,
                        PREFIX_MATCHMAKE,
                        PREFIX_REGISTER_COUNTRY,
                        PREFIX_REGISTER_PLATFORM,
                        PREFIX_REGISTER_PLAYER,
                        PREFIX_PROFILE],
    /*matchmakers*/ [/*PREFIX_MATCH_END,    
                        PREFIX_MATCHMAKE,
                        PREFIX_LIST,
                        PREFIX_PROFILE*/],
    /*registers*/   [/*PREFIX_REGISTER_COUNTRY,
                        PREFIX_REGISTER_PLATFORM,
                        PREFIX_REGISTER_PLAYER,
                        PREFIX_PROFILE*/],
    /*owner*/       [PREFIX_MATCH_DECLARE,
                        PREFIX_RATING,
                        PREFIX_MATCH_END,
                        PREFIX_REGISTER,
                        PREFIX_LIST,
                        PREFIX_MATCHMAKE,
                        PREFIX_REGISTER_COUNTRY,
                        PREFIX_REGISTER_PLATFORM,
                        PREFIX_REGISTER_PLAYER,
                        PREFIX_PROFILE],
    /*player*/      [PREFIX_MATCH_DECLARE, 
                        PREFIX_ACCEPT_MATCH, 
                        PREFIX_REGISTER_PLAYER,
                        PREFIX_PROFILE,
                        PREFIX_RATING],
];

function throwErrorMessage(channelID){
    bot.sendMessage({
        to: channelID,
        message: "Something wrong happend, check your parameters."
    });
}

function notEnoughParametersMessage(syntax,channelID){
    bot.sendMessage({
        to: channelID,
        message: "Not enough parameters, the correct syntax is: " + syntax
    });
}

function throwExistMessage(channelID, collection, exists){
    var extra = exists? " already exists." : "doesn't exist.";
    bot.sendMessage({
        to: channelID,
        message: "the specified " + collection + " " + extra
    });
}

bot.on('ready', () => {
    /*MATCH_FINISH_MODEL.find({}, function(err,messages){
        messages.forEach(message => {
            bot.fetchMessage(message.message_id);
        });
    });*/
});

//mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
bot.on('messageReactionAdd', function( reaction, user ){
    //✅
    //❌
    //reacct.d.member.user.id
    //reacct.d.emoji.name
    //reacct.d.message_id
    bot.sendMessage({
        to: reaction.d.channelID,
        message: JSON.stringify(reaction)
    });
    if(reaction.d.member.user.id == '420042963624919040' || reaction.d.member.user.id == '351114285155614720' || reaction.d.member.user.id == '142798704703700992'){
        MATCH_FINISH_MODEL.findOne({"message_id": reaction.d.message_id}).exec(function(err, finish){
            if(err) throwErrorMessage(reaction.d.channelID);
            if(finish){
                if(reaction.d.member.user.id == finish.reacter){
                    switch(reaction.d.emoji.name) {
                        case '✅':
                            bot.sendMessage({
                                to: reaction.d.channelID,
                                message: "teseting ✅"
                            });
                        break;
                        case '❌':
                            bot.sendMessage({
                                to: reaction.d.channelID,
                                message: "teseting ❌"
                            });
                        break;
                    }
                }
            } else throwExistMessage(reaction.d.channelID, MATCH_FINISH_COLLECTION, false)
        });
    }
});

bot.on('message', async function (user, userID, channelID, message, evt) {
    var syntax = "";
    if(message.substring(0,2) == "--"){
        message = message.substring(2,message.length);
        var params = message.split(" ");
        USER_MODEL.findOne({"discord_id": userID}).populate("role").exec(function(err, admin){
            PLAYERS_MODEL.findOne({"discord_id": userID}).exec(function(err2, player){
                var isAdmin = false;
                if(admin || player){
                    var access = false;
                    if(admin){
                        isAdmin = true;
                        admin.role.forEach(function(role){
                            MIDDLEWARE[role.priviledge-1].forEach(function(value){
                                if(params[FUNCTION] == value||params[FUNCTION] == "commands"){
                                    access = true;
                                    return;
                                }
                            });
                        });       
                    }
                    if(player){
                        MIDDLEWARE[4].forEach(function(value){
                            if(params[FUNCTION] == value){
                                access = true;
                                return;
                            }
                        });
                    }
                    if(access)
                    switch(params[FUNCTION]){
                        case PREFIX_RATING:
                            syntax = "--rating {@winner} {@losser}";
                            if(isAdmin && userID != '420042963624919040'){
                                if (evt.d.mentions.length == 2) {
                                var wId = params[1].substring(2,params[1].length-1);
                                wId = wId.indexOf('!') >= 0 ? wId.substring(1) : wId;
                                var lId = params[2].substring(2,params[2].length-1);
                                lId = lId.indexOf('!') >= 0 ? lId.substring(1) : lId;
                                PLAYERS_MODEL.findOne({"discord_id":wId}, function(err1,winner){
                                PLAYERS_MODEL.findOne({"discord_id":lId}, function(err2,losser){
                                    if(err1 || err2){ throwErrorMessage(channelID); return;}
                                    if(!winner || !losser){ throwExistMessage(channelID, "player", false); return;}
                                    var p = Number.parseFloat ( winner.elo);
                                    TB1 = p < 2000 ? 100 : 0;
                                    var v = Number.parseFloat ( losser.elo);
                                    TB2 = v < 2000 ? 100 : 0;
                                    var win = 1;

                                    var P = p + 300*(win - 1/(1 + Math.pow(10,(-(p-v)/1000)))) + (win)*TB1;
                                    var V = v + 300*((1-win) - 1/(1 + Math.pow(10,(-(v-p)/1000)))) + (1-win)*TB2;
                                    winner.elo = Math.round(P);
                                    winner.wins++;
                                    winner.games_played++;
                                    winner.last_game_date = Date.now();
                                    losser.elo = Math.round(V);
                                    losser.losses++;
                                    losser.games_played++;
                                    losser.last_game_date = Date.now();

                                    var history = {
                                        challenger: winner._id,
                                        challengee: losser._id,
                                        winner: winner._id,
                                        game_date: Date.now(),
                                        challenger_old_rating: p,
                                        challenger_new_rating: P,
                                        challengee_old_rating: v,
                                        challengee_new_rating: V,
                                        status: 1,
                                    }

                                    MATCHMAKING_HISTORY_MODEL.create(history, function(res){
                                        if(!err) {
                                            winner.save();
                                            losser.save();
                                            
                                            bot.sendMessage({
                                                to: channelID,
                                                message: "Old <@"+ wId + "> elo: " + p + " - New <@"+ wId + "> elo: " + Math.round(P) + "\nOld <@"+ lId + "> elo: " + v + " - New <@"+ lId + "> elo: " + Math.round(V)
                                            });
                                        }
                                        else
                                            bot.sendMessage({
                                                to: channelID,
                                                message: "Something wrong happend when creating this match history! just in case, the elo's have been reverted, please try again"
                                            });
                                        
                                        });
                                });
                                });
                                } else notEnoughParametersMessage(syntax,channelID);
                            } else {
                                if(userID == '420042963624919040'){
                                    //evt.d.id
                                    syntax = "--rating {@mention} {<|>} {@mention} {date only xx/yy/zz} {score}";
                                    if (params.length == 6) {
                                        var writer = userID;
                                        var p1 = params[1].substring(2,params[1].length-1);
                                        p1 = p1.indexOf('!') >= 0 ? p1.substring(1) : p1;
                                        var p2 = params[3].substring(2,params[3].length-1);
                                        p2 = p2.indexOf('!') >= 0 ? p2.substring(1) : p2;
                                        var reacter = writer == p1 ? p2 : writer == p2 ? p1 : '0';
                                        if(reacter == '0'){
                                            bot.sendMessage({
                                                to: channelID,
                                                message: "you can only create ratings for your own matches"
                                            });
                                            return;
                                        }
                                        var winner = writer;
                                        var losser = reacter;
                                        switch(params[2]){
                                            case '<':
                                                winner = p2;
                                                losser = p1;
                                            break;
                                            case '>':
                                                winner = p1;
                                                losser = p2;
                                            break;
                                        }
                                        PLAYERS_MODEL.findOne({"discord_id":writer}, function(err1,writer){
                                        PLAYERS_MODEL.findOne({"discord_id":reacter}, function(err2,reacter){
                                            if(err1 || err2){ throwErrorMessage(channelID); return;}
                                            if(!writer || !reacter){ throwExistMessage(channelID, "player", false); return;}
                                            var coll = {
                                                writer: writer.discord_id,
                                                reacter: reacter.discord_id,
                                                winner: winner,
                                                losser: losser,
                                                channel_id: channelID,
                                                message_id: evt.d.id,
                                                match_date: params[4],
                                                score: params[5]
                                            }
                                            MATCH_FINISH_MODEL.create(coll, function(err){
                                                if(!err) {
                                                    bot.sendMessage({
                                                        to: channelID,
                                                        message: "Waiting for reaction to your message"
                                                    });
                                                    bot.fetchMessage(evt.d.id);
                                                }
                                                else
                                                    throwErrorMessage(channelID);
                                            });
                                        });
                                        });
                                    } else notEnoughParametersMessage(syntax,channelID);
                                }
                            }
                        break;
                        case PREFIX_REGISTER:
                            syntax = "--register {@mention} {role}";
                            if(params.length == 3){
                                ROLES_MODEL.findOne({"name": params[REGISTER_ROLE_POSITION]}, function(role_err,role_res){
                                    if(!role_err){
                                    if(role_res){
                                        USER_MODEL.findOne({discord_id: evt.d.mentions[0].id}, function(user_err,user_res){
                                            if(!user_err){
                                                if(!user_res){
                                                    var discord_id= ""+evt.d.mentions[0].id;
                                                    var coll = {
                                                        discord_id: discord_id,
                                                        tag: params[1],
                                                        created: Date.now()
                                                    }
                                                    var User = new USER_MODEL(coll);
                                                    User.save(function(err){
                                                        if(!err){
                                                            User.role.push(role_res._id);
                                                            User.save();
                                                            bot.sendMessage({
                                                                to: channelID,
                                                                message: "User registered"
                                                            });
                                                        } else 
                                                            throwErrorMessage(channelID);
                                                    });
                                                } else {    
                                                    user_res.role.push(role_res._id);
                                                    user_res.save();
                                                }
                                            } else throwErrorMessage(channelID);
                                        });
                                    } else throwExistMessage(channelID, "role", false); } else throwErrorMessage(channelID);
                                });
                            } else notEnoughParametersMessage(syntax,channelID);
                        break;
                        case PREFIX_REGISTER_PLAYER:
                            syntax = "--regPlayer {@mention} {name} {country code{2}} {platform{2}} [hours]";
                            if(params.length >= 5){
                                var playerId = params[1].substring(2,params[1].length-1);
                                playerId = playerId.indexOf('!') >= 0 ? playerId.substring(1) : playerId;
                                PLAYERS_MODEL.findOne({'discord_id': playerId}, function(e1,r1){
                                    if(!e1){
                                    if(!r1){
                                        COUNTRIES_MODEL.findOne({"code": params[REGISTER_COUNTRY_CODE_POSITION].toLowerCase()}, function(e2,r2){
                                            if(!e2 && r2){
                                                PLATFORMS_MODEL.findOne({"code": params[REGISTER_PLATFORM_POSITION].toLowerCase()}, function(e3,r3){
                                                    if(!e3 && r3){
                                                        ROLES_MODEL.findOne({"name": "player"}, function(role_err,role_res){
                                                            if(!role_err){
                                                            if(role_res){
                                                                USER_MODEL.findOne({discord_id: playerId}, function(user_err,user_res){
                                                                    if(!user_err){
                                                                        if(!user_res){
                                                                            var coll = {
                                                                                discord_id: ""+playerId,
                                                                                tag: params[1],
                                                                                created: Date.now()
                                                                            }
                                                                            var User = new USER_MODEL(coll);
                                                                            User.save(function(err){
                                                                                if(!err){
                                                                                    User.role.push(role_res._id);
                                                                                    User.save();
                                                                                } else 
                                                                                    throwErrorMessage(channelID);
                                                                            });
                                                                        } else {
                                                                            user_res.role.push(role_res._id);
                                                                            user_res.save();
                                                                        }
                                                                    } else throwErrorMessage(channelID);
                                                                });
                                                            } else throwExistMessage(channelID, "role", false); } else throwErrorMessage(channelID);
                                                        });
                                                        var hours = params.length == 6 ? params[REGISTER_HOURS_POSITION] : -1;
                                                        var coll = {
                                                            discord_id: playerId,
                                                            name: params[REGISTER_NAME_POSITION],
                                                            tag: params[REGISTER_TAG_POSITION],
                                                            country: r2._id,
                                                            platform: r3._id,
                                                            created: evt.d.timestamp,
                                                            games_played: 0,
                                                            wins: 0,
                                                            losses: 0,
                                                            elo: 1500,
                                                            hours: hours,
                                                            last_game_date: evt.d.timestamp
                                                        }
                                                        PLAYERS_MODEL.create(coll, function(err){
                                                            if(!err) 
                                                                bot.sendMessage({
                                                                    to: channelID,
                                                                    message: "Player registered"
                                                                });
                                                            else
                                                                throwErrorMessage(channelID);
                                                        });
                                                    } else throwErrorMessage(channelID);
                                                });
                                            } else throwErrorMessage(channelID);
                                        });
                                    } else throwExistMessage(channelID, "user", true)} else throwErrorMessage(channelID);
                                });
                            } else notEnoughParametersMessage(syntax,channelID);
                        break;
                        case PREFIX_REGISTER_COUNTRY:
                            syntax = "--regCountry {name} {country code{2}}";
                            if(params.length == 3){
                                if(params[COUNTRY_CODE].length == 2){
                                    COUNTRIES_MODEL.findOne({"code": params[COUNTRY_CODE].toLowerCase()}, function(e1,r1){
                                        if(!e1){
                                        if(!r1){
                                            var coll = {
                                                name: params[COUNTRY_NAME],
                                                code: params[COUNTRY_CODE].toLowerCase(),
                                            }
                                            COUNTRIES_MODEL.create(coll, function(err){
                                                if(!err) 
                                                    bot.sendMessage({
                                                        to: channelID,
                                                        message: "Country registered"
                                                    });
                                                else
                                                    throwErrorMessage(channelID);
        
                                            });
                                        } else throwExistMessage(channelID, "country", true); } else throwErrorMessage(channelID);
                                    });
                                } else {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: "Country code must be 2 digits length"
                                    });
                                }
                            } else notEnoughParametersMessage(syntax,channelID);
                        break;
                        case PREFIX_REGISTER_PLATFORM:
                            syntax = "--regPlatform {name} {platform code{2}}";
                            if(params.length == 3){
                                if(params[PLATFORM_CODE].length == 2){
                                    PLATFORMS_MODEL.findOne({"code": params[PLATFORM_CODE].toLowerCase()}, function(e1,r1){
                                        if(!e1){
                                        if(!r1){
                                            var coll = {
                                                name: params[PLATFORM_NAME],
                                                code: params[PLATFORM_CODE].toLowerCase(),
                                            }
                                            PLATFORMS_MODEL.create(coll, function(err){
                                                if(!err) 
                                                    bot.sendMessage({
                                                        to: channelID,
                                                        message: "Platform registered"
                                                    });
                                                else
                                                    throwErrorMessage(channelID);
        
                                            });
                                        } else throwExistMessage(channelID, "platform", true); } else throwErrorMessage(channelID);
                                    });
                                } else {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: "Country code must be 2 digits length"
                                    });
                                }
                            } else notEnoughParametersMessage(syntax,channelID);
                        break;
                        case PREFIX_MATCH_DECLARE:
                            syntax = "--challenge {@challengee}";
                            if(params.length == 2){
                                PLAYERS_MODEL.findOne({"discord_id": evt.d.mentions[0].id}, function(err,opponent){
                                    if(!err){
                                    if(opponent){
                                        MATCHMAKING_MODEL.findOne({$or: [{"challenger": player._id}, {"challengee": player._id}]}, function(err, currentMatch){
                                            if(!err){
                                            if(!currentMatch){
                                                DECLARE_MATCHES_MODEL.findOne({$and: [{"challenger": player._id}, {"challengee": opponent._id}]}, function(err, declared){
                                                    if(!err){
                                                    if(!declared){
                                                        var coll = {
                                                            challenger: player._id,
                                                            challengee: opponent._id,
                                                            created_date: Date.now()
                                                        }
                                                        DECLARE_MATCHES_MODEL.create(coll, function(e){
                                                            if(!e){
                                                                bot.sendMessage({
                                                                    to: channelID,
                                                                    message: "<@" + player.discord_id + "> has declared a match against <@" + opponent.discord_id + ">!"
                                                                });
                                                            } else throwErrorMessage(channelID);
                                                        });
                                                    } else throwExistMessage(channelID, "declared match", true)} else throwErrorMessage(channelID);
                                                });
                                            } else {
                                                bot.sendMessage({
                                                    to: channelID,
                                                    message: "You already have a match, you can't declare a fight against someone else until you finish your current match."
                                                })
                                            }} else throwErrorMessage(channelID);
                                        });
                                    } else throwExistMessage(channelID,"player",false); } else throwErrorMessage(channelID);
                                });
                            } else notEnoughParametersMessage(syntax, channelID);
                        break;
                        case PREFIX_ACCEPT_MATCH:
                            syntax = "--accept {@challenger}";
                            if(params.length == 2){
                                PLAYERS_MODEL.findOne({'discord_id': evt.d.mentions[0].id}, function(err,p){
                                    if(!err){
                                    if(p){
                                        MATCHMAKING_MODEL.findOne({$and: 
                                            [{'challenger':p._id},{'challengee':p._id},{'challenger':player._id},{'challengee':player._id}]}, 
                                            function(err, match1){
                                                if(!err){
                                                if(!match1){
                                                    DECLARE_MATCHES_MODEL.findOne({$and: 
                                                        [{"challenger": p._id}, {"challengee": player._id}]
                                                    }, function(err, match){
                                                        if(!err){
                                                        if(match){
                                                            var date = new Date(Date.now());
                                                            var exp = date.setDate(date.getDate() + 7);
                                                            var coll = {
                                                                challenger: p._id,
                                                                challengee: player._id,
                                                                created_date: Date.now(),
                                                                expiry_date: exp
                                                            }
                                                            MATCHMAKING_MODEL.create(coll, function(err){
                                                                if(!err){
                                                                    bot.sendMessage({
                                                                        to:channelID,
                                                                        message: "You have accepted the match from <@" +  p.discord_id + ">, it's time to fight and show the results."
                                                                    });
                                                                } else throwErrorMessage(channelID);
                                                            });
                                                            match.remove();
                                                        } else throwExistMessage(channelID, "declared match ", false); } else throwErrorMessage(channelID);
                                                    });
                                                } else {
                                                    bot.sendMessage({
                                                        to: channelID,
                                                        message: "One or both players are already in a match, you can't accept this declare."
                                                    })
                                                }} else throwErrorMessage(channelID);
                                        });
                                    } else throwExistMessage(channelID, "player", false); } else throwErrorMessage(channelID);
                                });
                            } else notEnoughParametersMessage(syntax, channelID);
                        break;
                        case PREFIX_MATCHMAKE:
                        /* ADMINS */
                            syntax = "--matchmake {@mention p1} {@mention p2}";
                            if(evt.d.mentions.length == 2){
                                PLAYERS_MODEL.find({$or: [{'discord_id': evt.d.mentions[0].id}, {'discord_id': evt.d.mentions[1].id}]}, function(err,players){
                                    if(!err){
                                    if(players.length == 2){
                                        MATCHMAKING_MODEL.find(
                                            {$or: [
                                                {'challenger': players[0]._id}, 
                                                {'challengee': players[0]._id},
                                                {'challenger': players[1]._id}, 
                                                {'challengee': players[1]._id}
                                            ]}, function(err,errorPlayers){
                                            if(!err){
                                            if(errorPlayers == 0){
                                                var coll = {
                                                    player1: players[0]._id,
                                                    player2: players[1]._id,
                                                    created_date: Date.now()
                                                }
                                                MATCHMAKING_MODEL.create(coll, function(err){
                                                    if(!err){
                                                        bot.sendMessage({
                                                            to: channelID,
                                                            message: "The match has bee successfully created!"
                                                        });
                                                    } else throwErrorMessage(channelID);
                                                });
                                            } else {
                                                bot.sendMessage({
                                                    to:channelID,
                                                    message: "One or both players are already in a match, this or these players can't be added to a new one"
                                                });
                                            } } else throwErrorMessage(channelID);
                                        });
                                    } else bot.sendMessage({to:channelID, message:"One or both players ain't registered as ranked players."}) } else throwErrorMessage(channelID);
                                });
                            } else notEnoughParametersMessage(syntax,channelID);
                        break;
                        case PREFIX_MATCH_END:
                        /* ADMIN */
                            syntax = "--end-match {@winner} {@losser} [delete]";
                            if(params.length == 3){
                                MATCHMAKING_MODEL.findOne()
                                .populate("challenger")
                                .populate("challengee").exec(function(err, match){
                                    if(!err){
                                    if(match){
                                        if(params[3] == "delete"){
                                            match.remove();
                                            return;
                                        }
                                        PLAYERS_MODEL.find({$or: 
                                            [{'discord_id': match.challenger.discord_id}, {'discord_id': match.challengee.discord_id}]}, 
                                            function(err,players){

                                            //syntax = "--rating {p} {v} {1|0}";
                                            var p = Number.parseFloat (players[1].elo);
                                            TB1 = p < 2000 ? 100 : 0;
                                            var v = Number.parseFloat (players[0].elo);
                                            TB2 = v < 2000 ? 100 : 0;
                                            var win = 1;
                                            var P = p + 300*(win - 1/(1 + Math.pow(10,(-(p-v)/1000)))) + (win)*TB1;
                                            var V = v + 300*((1-win) - 1/(1 + Math.pow(10,(-(v-p)/1000)))) + (1-win)*TB2;

                                            players[0].elo = V;
                                            players[1].elo = P;

                                            players[0].games_played++;
                                            players[0].wins++;
                                            players[0].last_game_date = Date.now();
                                            players[0].save();
                                            players[1].games_played++;
                                            players[1].wins++;
                                            players[1].last_game_date = Date.now();
                                            players[1].save();

                                            var coll = {
                                                challenger: players[0]._id,
                                                challengee: players[1]._id,
                                                winner: players[0]._id,
                                                created_date: match.created_date,
                                                game_date: Date.now(),
                                                challenger_old_rating: v,
                                                challenger_new_rating: p,
                                                challengee_old_rating: V,
                                                challengee_new_rating: P,
                                                status: 1,
                                            }

                                            MATCHMAKING_HISTORY_MODEL.create(coll, function(err){
                                                if(err){
                                                    bot.sendMessage({
                                                        to: channelID,
                                                        message: "The match failed to register in the history match."
                                                    });
                                                } else {
                                                    bot.sendMessage({
                                                        to: channelID,
                                                        message: "Match has successfully ended."
                                                    })
                                                }
                                            });
                                        });
                                        match.remove();
                                        return;
                                    } else throwExistMessage(channelID,'matchmake',false)} else throwErrorMessage(channelID);
                                });
                            } else notEnoughParametersMessage(syntax,channelID);
                        break;
                        case PREFIX_PROFILE:
                            syntax = "--profile [@player]";
                            if(evt.d.mentions.length > 0){
                                PLAYERS_MODEL.findOne({"discord_id": evt.d.mentions[0].id}, function(err, pl){
                                    if(!err){
                                    if(pl){
                                        message = "- Discord: '<@" + pl.discord_id /*+ "' | Country: '" + pl.country.name */+ ">' | elo: '" + pl.elo + "'\n";
                                        bot.sendMessage({
                                            to: channelID,
                                            message: message
                                        });
                                    } else throwExistMessage(channelID, "player", false); } else throwErrorMessage(channelID);
                                });
                            } else {
                                PLAYERS_MODEL.findOne({"discord_id": userID}, function(err, pl){
                                    if(!err){
                                    if(pl){
                                        message = "- Discord: '<@" + pl.discord_id /*+ "' | Country: '" + pl.country.name */+ ">' | elo: '" + pl.elo + "'\n";
                                        bot.sendMessage({
                                            to: channelID,
                                            message: message
                                        });
                                    } else throwExistMessage(channelID, "player", false); } else throwErrorMessage(channelID);
                                });
                            }
                        break;

                        case PREFIX_LIST:
                            syntax = "--list {collection}";
                            if(params.length == 1){
                                bot.sendMessage({
                                    to: channelID,
                                    message: ""+
                                    "```Available collections: \n"+
                                    "1) " + ROLES_COLLECTION+ ", Available roles\n"+
                                    "2) " + PLATFORMS_COLLECTION+", Available platforms\n"+
                                    "3) " + COUNTRIES_COLLECTION+", Available countries\n"+
                                    "4) " + USERS_COLLECTION+", Available users\n"+
                                    "5) " + MATCHMAKING_COLLECTION+", Matchmakings in progress\n"+
                                    "6) " + MATCHMAKING_HISTORY_COLLECTION+", History\n"+
                                    "7) commands```"
                                });
                            } else {
                                var message = "";
                                switch(params[1]){
                                    case COUNTRIES_COLLECTION:
                                        COUNTRIES_MODEL.find({}, function(err, objects){
                                            message += "List of available countries\n";
                                            if(objects.length == 0) message = "The collection is empty.";
                                            else {
                                                objects.forEach(function(document){
                                                    message += "- Name: " + document.name + " | Code: " + document.code.toUpperCase() + "\n";
                                                });
                                            }
                                            message += "";
                                            bot.sendMessage({
                                                to:channelID,
                                                message: message
                                            });
                                        });
                                    break;
                                    case PLATFORMS_COLLECTION:
                                        PLATFORMS_MODEL.find({}, function(err, objects){
                                            message += "List of available platforms\n";
                                            if(objects.length == 0) message = "The collection is empty.";
                                            else {
                                                objects.forEach(function(document){
                                                    message += "- Name: " + document.name + " | Code: " + document.code.toUpperCase() + "\n";
                                                });
                                            }
                                            message += "";
                                            bot.sendMessage({
                                                to:channelID,
                                                message: message
                                            });
                                        });
                                    break;
                                    case ROLES_COLLECTION:
                                        ROLES_MODEL.find({}, function(err, objects){
                                            message += "List of available roles\n";
                                            if(objects.length == 0) message = "The collection is empty.";
                                            else {
                                                objects.forEach(function(document){
                                                    message += "- Name: '" + document.name + "'\n";
                                                });
                                            }
                                            message += "";
                                            bot.sendMessage({
                                                to:channelID,
                                                message: message
                                            });
                                        });
                                    break;
                                    case USERS_COLLECTION:
                                        USER_MODEL.find({}).populate("role").exec(function(err,objects){
                                            message += "List of users\n";
                                            if(objects.length == 0) message = "The collection is empty.";
                                            else {
                                                objects.forEach(function(document){
                                                    message += "- Discord: '<@" + document.discord_id + ">' | Role: '" + document.role.name + "'\n";
                                                });
                                            }
                                            message += "";
                                            bot.sendMessage({
                                                to:channelID,
                                                message: message
                                            });
                                        });
                                    break;
                                    case MATCHMAKING_COLLECTION:
                                        message += "List of matchmakings that are taking place now.\n";
                                        MATCHMAKING_MODEL.find({}).populate("challenger").populate("challengee").exec(function(err, matches){
                                            matches.forEach(function(match){
                                                var date = match.created_date.getDate();
                                                var month = match.created_date.getMonth();
                                                var year = match.created_date.getFullYear();
                                                var dateString = date + "/" +(month + 1) + "/" + year;
                                                message += dateString + " - <@" + match.challenger.discord_id + "> vs <@" + match.challengee.discord_id + ">\n";
                                            });
    
                                            bot.sendMessage({
                                                to: channelID,
                                                message: message
                                            })
                                        });
                                    break;
                                    case MATCHMAKING_HISTORY_COLLECTION:
                                        syntax = '--list history {mention? [yes|no]} [@player [limit]]';
                                        message += "List of matchmaking history.\n";
                                        message += "```Note: for a better check of history use: "+ syntax+ "\n```";
                                        var mention = params[2] == 'yes' ? true : params[2] == 'no' ? false : throwErrorMessage(channelID);
                                        var hasPlayer = params.length >= 4 ? true : false;
                                    
                                        var filterPlayer = {};
                                        if(hasPlayer){
                                            var discord_id = params[3].substring(2,params[3].length-1);
                                            discord_id = discord_id.indexOf('!') >= 0 ? discord_id.substring(1) : discord_id;
                                            filterPlayer = {'discord_id': discord_id};
                                        }
                                        PLAYERS_MODEL.findOne(filterPlayer, function(err,player){
                                            if(!err){
                                            if(player || !hasPlayer){
                                                var filter = hasPlayer ? {$or: [{'challenger': player._id},{'challengee': player._id}]} : {};

                                                var promise_matchmaking = MATCHMAKING_HISTORY_MODEL.find(filter).populate('challenger').populate('challengee').populate('winner');
                                                if(params.length == 5)
                                                    promise_matchmaking.limit(params[3]);
                                                else
                                                    promise_matchmaking.limit(10);

                                                promise_matchmaking.sort({date: 1}).exec(function(err, matches){
                                                    if(!err){
                                                    if(matches){
                                                        matches.forEach(function(match){
                                                            challenger = mention ? "<@" + match.challenger.discord_id + ">" : match.challenger.name;
                                                            challengee = mention ? "<@" + match.challengee.discord_id + ">" : match.challengee.name;
                                                            winner = mention ? "<@" + match.winner.discord_id + ">" : match.winner.name;
                                                            message += "```"+match.game_date+"``` "+challenger+" vs "+challengee+" resulted in "+winner+"\n";
                                                        });
                                                        bot.sendMessage({
                                                            to:channelID,
                                                            message: message
                                                        })
                                                    } else bot.sendMessage({to: channelID, message: 'The player has not recorded any finished challenges'});} else throwErrorMessage(channelID);
                                                });
                                            } else throwExistMessage(channelID, 'player', false); } else throwErrorMessage(channelID);
                                        });
                                        
                                    break;
                                    case "commands":
                                        message+= "List of commands: \n";
                                        message+= PREFIX_LIST + ": lists the available collections.\n"+
                                                PREFIX_REGISTER_PLAYER + ": Register a new player\n"+
                                                PREFIX_REGISTER_PLATFORM + ": Register a new platform\n"+
                                                PREFIX_REGISTER_COUNTRY + ": Register a new country\n"+
                                                PREFIX_REGISTER + ": Register a new user\n"+
                                                PREFIX_MATCHMAKE + ": Register a new matchmake.";
                                        bot.sendMessage({
                                            to:channelID,
                                            message:message
                                        });
                                    break;
                                    default:
                                        bot.sendMessage({
                                            to: channelID,
                                            message: "The collection doesn't exist, use --list to see the available collections."
                                        });
                                    break;
                                }
                            }
                        break;
                        default:
                            bot.sendMessage({
                                to: channelID,
                                message: "Unrecognized command"
                            });
                        break;
                    }
                    else {
                        bot.sendMessage({
                            to: channelID,
                            message: "I'm sorry, you don't have the priviledge to use this command."
                        })
                    }
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: "You are not registered as a user, I can't allow you do anything."
                    })
                }
            });
        });
    }
});