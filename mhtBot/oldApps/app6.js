// Loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var sentimentService = require('./sentiment-service');
var keywordService = require('./keyword-service');

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

var bot = new builder.UniversalBot(connector, [
	function(session){
		session.send('Hi, I\'m MaxBot. I hope we\'ll be able to work together to help you');
		session.beginDialog('introQs');
	}
]);

server.post('/api/messages', connector.listen());

//===================
// Global Variables
//===================
var score = 0;

//======================
// Setup Text Analytics
//======================



//=============
// Bot Dialogs
//=============

bot.dialog('introQs', [
	function(session, args, next){
		builder.Prompts.text(session, 'What has led you to seek an assessment for depression/anxiety?');
	}, 
	function(session, results, next){
		var userResponse = results.response;
		var sentiment = returnSentiment(session, userResponse);
		var keywords = returnKeywords(session, userResponse);

		console.log("Sentiment score identified is: " + sentiment);
		session.send("Sentiment score identified is: " + sentiment);
		console.log("Keywords/phrases identified are: " + keywords);
		session.send("Keywords/phrases identified are: " + keywords);

		next();
	},
	function(session){
		builder.Prompts.text(session, 'What has triggered any negative thoughts and feelings?');
	},
	function(session, results, next){
		returnSentiment(session, results.response);
		next();
	},
	function(session){
		builder.Prompts.text(session, 'What have these thoughts and feelings stopped you doing?');
	},
	function(session, results, next){
		returnSentiment(session, results.response);
		next();
	},
	function(session){
		builder.Prompts.text(session, 'Do you have a care plan and, if so, is it working for you?');
	},
	function(session, results, next){
		returnSentiment(session, results.response);
		next();
	},
	function(session, args, next){
		session.send("Thank you for answering these questions");
		next();
	},
	function(session){
		session.beginDialog('phq9');
	}
]);

bot.dialog('phq9', [
	function (session, args, next){
		console.log('Entering dialog phq9');
		session.send("I'm now going to ask you some questions about how you've felt over the past two weeks");
		next();
	},
	function(session){
		console.log("Asking phq9 q1");
		builder.Prompts.text(session, "How often have you had little interest or pleasure in doing things?");
	}, 
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
					session.send(getBotResponse(entity));
			// END OF SEPARATE FUNCTION
					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		console.log("phq9 q2");
		builder.Prompts.text(session, "How often do you feel down, depressed, or hopeless?");
	},
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous function

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, 'How often have you had trouble falling or staying asleep, or sleeping too much?');
	},
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous functio

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you been bothered by feeling tired or having little energy?");
	},
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous functio

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you had a poor appetite or overeat?");
	}, 
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous functio

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you felt bad about yourself - or that you are a failure or have let yourself or your family down?");
	}, 
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous functio

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you had trouble concentrating on things, such as reading the newspaper or watching television?");
	}, 
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous functio

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you moved or spoken so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you've been moving around a lot more than usual?");
	}, 
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous functio

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you had thoughts that you'd be better off dead or of hurting yourself in some way?");
	},
	function(session, results, next){ 
		// process question results
		console.log("Processing user response");
		var userResponse = session.message.text;
		console.log(userResponse);

		// Recognises entity.
		// TO BE PUT IN SEPARATE FUNCTION
		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);
			// END OF SEPARATE FUNCTION
					//session.send(getBotResponse(entity));	// uncomment out when have fixed the problems associated with asychronous function

					console.log("Score for phq0 q2 is %i", getScore(entity));
					score+=getScore(entity);
					console.log("Score after phq9 q1 is %i", score);
				}else{
					console.log("No entity identified");
				}
			});
		next();
	},
	function(session){
		var severity = getSeverity(score);
		console.log("The user's score of %i indicates that the user has %s depression", score, severity);
		session.endDialog('Thank you for completing these questions. Your score is %i. Please note that this score is provided to enable you to reflect on your situation; it in no way infers a medical diagnosis', score);
	}
]);

function getBotResponse(entity){
	var response = null;
	if(entity == "NearlyEveryDay"){
		response = "I'm sorry to hear that";
	}else if(entity == "MoreThanHalfTheDays"){
		response = "I'm sorry to hear that";
	}else if(entity == "SeveralDays"){
		response = "Thank you";
	}else if(entity == "NotAtAll"){
		response = "I'm glad to hear that";
	}else{
		response = "I don't recognise that entity";
	}
	return response;
}

function getScore(entity){
	var score = 0;
	switch(entity){
		case 'NotAtAll':
			return 0;
			break;
		case 'SeveralDays':
			return 1;
			break;
		case 'MoreThanHalfTheDays':
			return 2;
			break;
		case 'NearlyEveryDay':
			return 3;
			break;
		default:
			return 20;
	}
}

function getSeverity(finalScore){
	var s = finalScore;
	if(s>=0 && s<=5){
		return 'mild';
	}else if(s>=6 && s<=10){
		return 'moderate';
	}else if(s>=11 && s<=15){
		return 'moderately severe';
	}else{
		return 'severe';
	}
}

//====================
// Sentiment Analysis
//====================

function returnSentiment(session, text){
	return sentimentService
				.getSentiment(text)
				.then(function(sentiment){ handleSuccessResponse(session, sentiment); })
				.catch(function(error){ handleErrorResponse(session, error); });
}

function returnKeywords(session, text){
	return keywordService
				.getKeywords(text)
				.then(function(keywords){ handleSuccessResponse(session, keywords); })
				.catch(function(error){ handleErrorResponse(session, error); });
}


//====================
// Response Handling
//====================

function handleSuccessResponse(session, textAnalyticOutput){
	if(textAnalyticOutput){
		console.log('Text Analytic API returned result');
	}else{
		console.log('Text Analytics API could not obtain result');
	}
}

function handleErrorResponse(session, error){
	var clientErrorMessage = 'Oops! Something went wrong. Try again later.';
    if (error.message && error.message.indexOf('Access denied') > -1) {
        clientErrorMessage += "\n" + error.message;
    }

    console.error(error);
    session.send(clientErrorMessage);
}



