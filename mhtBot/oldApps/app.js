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
		console.log('Send greeting');
		session.send('Hi, I\'m MaxBot. I hope we\'ll be able to work together to help you');
		session.beginDialog('phq9Questions');
	}
]);

server.post('/api/messages', connector.listen());

// LUIS recogniser
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

// Sends greeting message
bot.on('conversationUpdate', function(message){
	bot.send('Hello. I\'m MaxBot');
	/*if(message.membersAdded){
		message.membersAdded.forEach(function(identity){
			if(identity.id === message.address.bot.id){
				var reply = new builder.Message().address(message.address).text('Hi, I\'m MaxBot. I hope we\'ll be able to work together to help you.');
				bot.send(reply);
			}
		});
	}*/
	session.beginDialog('phq9Questions');
});

//=============
// Bot Dialogs
//=============

bot.dialog('phq9Questions', [
	function (session, args, next){
		session.send('Entering dialog phq9');
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you had little interest or pleasure in doing things?");
	}, 
	function(session, results){ 
		var freqEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'NearlyEveryDay');
		console.log(freqEntity);
	},
	function(session){
		sesssion.endDialog('Ending dialog');
	}
]);


// Creates an intent recogniser
var intents = new builder.IntentDialog({recognizers: [recognizer]});

//bot.dialog('/', intents);

bot.dialog('phq9', [
	function(session, args, next){
		var freqEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'NearlyEveryDay');
		console.log(freqEntity);
	},
	function(session){
		session.endDialog();
	}
]).triggerAction({
	matches: 'phq9'
});

dialog.onDefault(builder.DialogAction.send("Did not understand"));


