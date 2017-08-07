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

// Create chat bot

// Create connector and listen for messages
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

server.post('/api/messages', connector.listen());

// LUIS recogniser

//var luisModelURL = process.env.LUIS_MODEL_URL;
//var luisRecognizer = new builder.LuisRecognizer(luisModelURL);

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

//bot.recognizer(new builder.LuisRecognizer(process.env.LUIS_MODEL_URL));


//=============
// Bot Dialogs
//=============

// Creates an intent recogniser
var intents = new builder.IntentDialog({recognizers: [recognizer]});

/*bot.dialog('/', intents);*/

/*
intents.onBegin(function (session, args, next){
	session.send("Hey!");
	builder.Prompts.text(session, 'Please say "not at all"');

	session.beginDialog('/NotAtAll');
	}
);*/

/*intents.matches('NotAtAll', function(session){
	session.sendTyping();
	session.send(process.env.ABOUT_ME_DIALOG);
});*/




//console.log(intents);
//bot.dialog('/', function(session){session.send("You said %s", session.message.text);});

//bot.dialog('/', intents); 

/*
bot.dialog('/NotAtAll', [
	function(session, args, next){
		var whatIntent = args.intent;
		console.log(whatIntent);
		//var reply = session.message.text;
		//var intent = results.intent;
		//console.log('User said %s', reply);
		//var getIntent = reply.intent;
		//console.log(getIntent);
		//var getIntent = results.response.luisRecognizer.intent;
		//console.log(getIntent);
		next();
	}, 
	function(session){
		session.send("Hey!");
		builder.Prompts.text(session, 'Please say "not at all"');
	},
	
	function(session){
		session.replaceDialog('/dialogTwo');
	}
]);*/

bot.dialog('FirstQuestions', [
	function (session, args, next){
		session.send('Entering dialog FirstQuestions');
		console.log('The user said \'%s\'', session.message.text);
		console.log("ARGS");
		console.log(args);
		var whatIntent = args.intent;
		console.log(whatIntent);
		next();
	},
	function(session){
		session.endDialog('How often have you had little interest or pleasure in doing things?');
	}
]).triggerAction({
	matches: 'MoreThanHalfTheDays'
});

bot.dialog('phq9', [
	function (session, args, next){
		session.send('I\'m glad to hear that');
		builder.Prompts.text(session, 'How often do you feel slowed down?');
	},
	function(session, args, next){
		session.send("In next function");
		var freqEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'NearlyEveryDay');
		console.log(freqEntity);
		next();
		next();
	},
	function (session, results){
		session.endDialog();
	}
]).triggerAction({
	matches: 'phq9'
});



/*
bot.dialog('/dialogTwo', [
	function(session, args, next){
		session.endDialog("End of conversation.");
	}
]);*/

/*
intents.matches('NotAtAll', function(session){
	session.sendTyping();
	session.send('I \'m glad to hear that');
});*/


/*intents.matches('NotAtAll', function(session){
	session.send("You said not at all");
	}
);*/

/*
intents.onDefault([
	function(session, args, next){
	session.send("Sorry...can you please rephrase?");
	}
]);*/


// Sends greeting message
/*
bot.on('conversationUpdate', function(message){
	if(message.membersAdded){
		message.membersAdded.forEach(function(identity){
			if(identity.id === message.address.bot.id){
				var reply = new builder.Message().address(message.address).text('Hi, I\'m MaxBot. I hope we\'ll be able to work together to help you.');
				bot.send(reply);
			}
		});
	}
});
*/






/*
var DialogLabels = {
	Intro: 'Intro',
	PHQ9: 'phq9',
	GAD7: 'gad7'
};


bot.dialog('intro', require('./intro.js'));
bot.dialog('phq9', require('./phq9.js'));
bot.dialog('gad7', require('./gad7.js'));

// log any bot errors to the console
bot.on('error', function(e){
	console.log('An error occured', e);
});
*/





