// Loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

//============
// Bot Setup
//============

// Setup restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

// ===============
// Create chat bot
// ===============

// Create connector and listen for messages
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

/*    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});*/

var bot = new builder.UniversalBot(connector, [
	function(session){
		session.send('Hi, I\'m MaxBot. I hope we\'ll be able to work together to help you');
		session.beginDialog('phq9');
	}
]);

server.post('/api/messages', connector.listen());

// LUIS recogniser
/*var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);*/

//=============
// Bot Dialogs
//=============

// Creates an intent recogniser
//var intents = new builder.IntentDialog({recognizers: [recognizer]});

//var intents = new builder.IntentDialog();

//bot.dialog('/', intents);

/*intents.onBegin(function(session, args, next){
	session.beginDialog('/phq9');
});*/

/*intents.matches('phq9', function(session){
	session.beginDialog('/phq9');
});*/

bot.dialog('phq9', [
	function (session, args, next){
		session.send('Entering dialog phq9');
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you had little interest or pleasure in doing things?");
	}, 
	function(session, results, next){ 
		console.log(results.response);
		console.log(session.message.text);
		/*var intent = builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				console.log(intents);
				console.log(intents[0].intent);
				console.log(entities);
				console.log(entities[0].type);
				session.send(entities[0].type);
			}
		);*/
		var text = session.message.text;
		console.log("The result from the getEntity() function is:");
		console.log(getEntity(text));
		//console.log(intent);
		session.send("I\'m sorry to hear that");
		next();
		//var freqEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'NearlyEveryDay');
		//console.log(freqEntity);
	},
	function(session){
		session.endDialog('Ending dialog');
	}
]).triggerAction({
	matches: 'phq9'
});

function getEntity(text){
	var entity = null;
	var intent = builder.LuisRecognizer.recognize(text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				console.log(intents);
				console.log(intents[0].intent);
				console.log(entities);
				console.log(entities[0].type);
				session.send(entities[0].type);
				var entity = entities[0].type;
			}
	);
	return entity;
}
