var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');
var credentials = require('./credentials.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 12725);
app.use(express.static('public'));

app.get('/', function (req, res, next){
	res.render('introduction');
});

app.get('/interfaces', function (req, res, next){
	res.render('interfaces');
});

app.get('/ISteamNews', function (req, res, next){
	res.render('ISteamNews');
});

app.get('/ISteamUser', function (req, res, next){
	res.render('ISteamUser');
});

app.get('/ISteamUserStats', function (req, res, next){
	res.render('ISteamUserStats');
});

app.post('/ISteamNews', function (req, res, next){
	var context = {};
	if (req.body['Run_Ex_1']){
		
		request('http://api.steampowered.com/ISteamNews/GetNewsForApp/v1/?appid=570&count=1', function(err, response, body){
			if(!err && response.statusCode < 400){
				 var result = (JSON.parse(body));
				 context.version1_title = result.appnews.newsitems.newsitem[0].title;
				 context.version1_author = result.appnews.newsitems.newsitem[0].author;
				 context.version1_url = result.appnews.newsitems.newsitem[0].url;
				 res.render('ISteamNews', context);
				 return;
			}
			else {
				console.log(err);
				if (response)
					console.log(response.statusCode);
				next(err);
			}});
	}
	
	if (req.body['Run_Ex_2']){
		request('http://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=570&count=1&feeds=pcgamer', function(err, response, body){
		if(!err && response.statusCode < 400){
			var result = (JSON.parse(body));
			context.version2_title = result.appnews.newsitems[0].title;
			context.version2_feedLabel = result.appnews.newsitems[0].feedlabel;
			context.version2_url = result.appnews.newsitems[0].url;
			res.render('ISteamNews', context);
			return;
	}
	else {
		console.log(err);
		if (response)
			console.log(response.statusCode);
		next(err);
	}});
	}
});

app.post('/ISteamUser', function (req, res, next){
	var context = {};
	if (req.body['Run_Ex_1']){
		
		request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v1/?key=' + credentials.steamKey + '&steamids=' + credentials.steamID, function(err, response, body){
			if(!err && response.statusCode < 400){
				 var result = (JSON.parse(body));
				 context.personaName = result.response.players.player[0].personaname;
				 context.realName = result.response.players.player[0].realname;
				 context.profileURL = result.response.players.player[0].profileurl;
				 res.render('ISteamUser', context);
				 return;
			}
			else {
				console.log(err);
				if (response)
					console.log(response.statusCode);
				next(err);
			}});
	}
	
	if (req.body['Run_Ex_2']){
		request('http://api.steampowered.com/ISteamUser/GetUserGroupList/v1/?key=' + credentials.steamKey + '&steamid=' + credentials.steamID, function(err, response, body){
		if(!err && response.statusCode < 400){
			var result = (JSON.parse(body));
			context.group = result.response.groups;
			res.render('ISteamUser', context);
			return;
		}
	else {
		console.log(err);
		if (response)
			console.log(response.statusCode);
		next(err);
	}});
	}
});


app.post('/ISteamUserStats', function (req, res, next){
	var context = {};
	if (req.body['Run_Ex_1']){
		
		request('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=' + credentials.steamKey + '&steamid=' + credentials.steamID + '&appid=227080', function(err, response, body){
			if(!err && response.statusCode < 400){
				 var result = (JSON.parse(body));
				 context.gameName = result.playerstats.gameName;
				 context.achievements = result.playerstats.achievements;
				 res.render('ISteamUserStats', context);
				 return;
			}
			else {
				console.log(err);
				if (response)
					console.log(response.statusCode);
				next(err);
			}});
	}
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});