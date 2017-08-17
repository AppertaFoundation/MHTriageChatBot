// Loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var sentimentService = require('./sentiment-service');
var keywordService = require('./keyword-service');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// https://www.npmjs.com/package/dateformat
var dateFormat = require('dateformat');
var moment = require('moment');

var mysql = require('mysql');

var dateFormatLite = require('date-format-lite');

//============
// Bot Setup
//============

// Setup restify Server
var server = restify.createServer();

/*server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});*/

server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));



// ==============================
// Connect to Azure SQL database
// ==============================

// Create connection to database
var config =
	{
		userName: 'mng17@mhtbotdb',
		password: '1PlaneFifth',
		server: 'mhtbotdb.database.windows.net',
		options:
			{
				database: 'mhtBotDB',
				encrypt: true,
			}
	}

var connection = new Connection(config);

connection.on('connect', function(err)
	{
		if(err){
			console.log(err)
		}else{
			//queryDatabase()
			console.log("Connection successful");
		}
	}
);

function queryDatabase()
{
	console.log('Reading rows from the Table...');

	// Read all rows from table
	request = new Request(
		"SELECT * FROM Users",
		function(err, rowCount, rows){
				console.log(rowCount + ' rows(s) returned');
				process.exit();
			}
		);

	request.on('row', function(columns){
		columns.forEach(function(column){
			console.log("%s\t%s", column.metadata.colName, column.value);
		});
			});
	connection.execSql(request);

}

function createNewConversationID(){
	console.log("Creating new ConversationID for this converstaion...");

	request = new Request(
		"INSERT INTO Conversations (UserID) VALUES (" + mysql.escape(session.dialogData.userID) + ";" +
		"SELECT @@identity",
		function(err, rowCount, rows){
			if(!err){
				conosle.log("New conversationID successfully created");
			}else{
				console.log("Error in creating new conversationID: " + err);
			}
		}
	);
}


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
		session.beginDialog('greeting');
	}
]);

server.post('/api/messages', connector.listen());

//===================
// Global Variables
//===================
var totalScore = 0;


var username = null;

var questionID = 0;

//=============
// Test Values
//=============

var userID = 3;

//=============
// Bot Dialogs
//=============

// Sends greeting message
/*bot.on('conversationUpdate', function(message){
	if(message.membersAdded){
		message.membersAdded.forEach(function(identity){
			if(identity.id === message.address.bot.id){
				//session.send("Hello");
				var reply = new builder.Message().address(message.address).text('Hi, I\'m MaxBot. I hope we\'ll be able to work together to help you.');
				//bot.send(reply);
				bot.beginDialog(message.address, 'greeting');
				//bot.beginDialog(message.address, 'introQs');
			}
		});
	}
});*/

bot.dialog('greeting', [
	function(session, args, next){
		builder.Prompts.confirm(session, "Are you already registered?");
	},
	function(session, results){
		session.sendTyping();
		var userResponse = results.response;
		if(userResponse == true){
			session.endDialog('Great, let\'s log you in');
			session.beginDialog('login');
		}else{
			session.send('No problem. Registering is quick and easy');
			session.beginDialog('register');
		}
	}
]);


bot.dialog('login', [
	function(session, args, next){
		builder.Prompts.text(session, "Please enter your username:");

	},
	function(session,results, next){
		session.dialogData.username = results.response;
		builder.Prompts.text(session, "Please enter your password:");
	},
	function(session, result){
		session.dialogData.password = result.response;

		request = new Request(
			"SELECT UserID FROM Users WHERE UserName =" +  mysql.escape(session.dialogData.username) + "AND Password = " + mysql.escape(session.dialogData.password),
			function(err, rowCount, rows){
				if(!err){
					console.log("no error");
					if(rowCount>0){
						console.log("User %s logged in.", session.dialogData.username);
						session.endDialog("Welcome back %s!", session.dialogData.username);
						session.beginDialog('introQs');
					}else{
						session.endDialog("Your username or password is incorrect");
					}
				}else{
					console.log("error" + err);
				}
			}
		);
		request.on('row', function(columns){
			console.log("Logged in user userID is: " + columns[0].value);
			session.userData.userID = columns[0].value;
			userID = session.userData.userID;
		});
		connection.execSql(request);
	}
]);


bot.dialog('register', [
	function(session, args, next){
		builder.Prompts.text(session, "Please enter a username of your choice:");
	},
	function(session, result){
		session.dialogData.username = result.response;
		builder.Prompts.text(session, "Please enter a password of your choice:");
	},
	function(session, result){
		session.dialogData.password = result.response;

		request = new Request(
			"INSERT INTO Users (UserName, Password) VALUES (" + mysql.escape(session.dialogData.username) + "," + mysql.escape(session.dialogData.password) + "); SELECT @@identity" + "",
				function(err, rowCount, rows){
					if(!err){
						console.log("User successfully inserted into table");
						session.send("You've succesfully registered");
						session.beginDialog('introQs');
					}else{
						console.log("Error" + err);
					}

				}
		);
		request.on('row', function(columns){
			console.log('Newly registered user id is: %d', columns[0].value);
			session.userData.userID = columns[0].value;
			userID = session.userData.userID;
		});
		connection.execSql(request);
	}
]);

function getBotMsgTime(session){
	//var botTime = new Date(session.userData.lastMessageSent);
	var botTime = new Date(session.userData.lastMessageSent);
	//var botTimeFormatted = dateFormat(botTime, "yyyy-mm-dd HH:MM:ss");
	var botTimeFormatted = botTime.format("yyyy-mm-dd HH:MM:ss");

	console.log("Bot messaged at: " + botTimeFormatted);
	return botTimeFormatted;
}

function getUserMsgTime(session){
	var userTime = new Date(session.message.localTimestamp);
	//var userTimeFormatted = dateFormat(userTime, "yyyy-mm-dd HH:MM:ss");
	var userTimeFormatted = userTime.format("yyyy-mm-dd HH:MM:ss");


	console.log("User responded at: " + userTimeFormatted);
	return userTimeFormatted;
}

function getTimeLapse(session){
	var botTime = new Date(session.userData.lastMessageSent);
	var userTime = new Date(session.message.localTimestamp);
	console.log("Time Lapse Info:");
	var timeLapseMs = userTime - botTime;
	console.log("Time lapse in ms is: " + timeLapseMs);
	var timeLapseHMS = convertMsToHMS(timeLapseMs);
	console.log("Time lapse in HH:MM:SS: " + timeLapseHMS);
	return timeLapseHMS;
}

function replaceSingleQuotes(str){
	str = str.replace("'", "''");
	console.log(str);
	return str;
}

function processUserResponse(session, results, questionNo){
		// Getting user response
		var userResponse = null;

		if(typeof results === 'string'){
			userResponse = results;
		}else{
			userResponse = results.response;
		}

		// Calculating time at which bot messaged
		var botTimeFormatted = new Date(getBotMsgTime(session));

		// Calculating time at which user responded
		var userTimeFormatted = new Date(getUserMsgTime(session));

		// Calculating time lapse between question raised and question answered
		var timeLapseHMS = getTimeLapse(session);

		var questionNo = questionNo;

		storeUserResponse(session, questionNo, userID, userResponse, botTimeFormatted, userTimeFormatted, timeLapseHMS);
}


bot.dialog('introQs', [
	function(session, args, next){
		// https://stackoverflow.com/questions/42069081/get-duration-between-the-bot-sending-the-message-and-user-replying
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, 'What has led you to seek an assessment for depression/anxiety?');
	}, 

	function(session, results, next){
		var questionNo = 1;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		builder.Prompts.text(session, 'What has triggered any negative thoughts and feelings?');
	},
	function(session, results, next){
		var questionNo = 2;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, 'What have these thoughts and feelings stopped you doing?');
	},
	function(session, results, next){
		var questionNo = 3;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.confirm(session, 'Do you have a care plan?');
	},
	function(session, results, next){
		var questionNo = 4;
	var userResponse = results.response;
	processUserResponseNew(session, session.message.text, questionNo);

	//processUserResponse(session, session.message.text, 4);
		if(userResponse == true){
			session.userData.lastMessageSent = new Date();
			builder.Prompts.text(session, 'Is it working for you?');
		}else{
			next();
		}
	},
	function(session, results, next){
		var questionNo = 5;
		processUserResponseNew(session, session.message.text, questionNo);
		//processUserResponse(session, results, 5);
		session.send("Thank you for answering these questions");
		next();
	},
	function(session){
		session.beginDialog('phq9');
	}
]);




function insertUserResponseData(questionID, botTime, userTime, timeLapse, questionNo, userID, userResponse, phq9Score, totalScore){
	if(questionNo == 14){
		request = new Request(
		"INSERT INTO TimeStamps (QuestionID, BotMsgTime, UserMsgTime, TimeLapse) " 
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(botTime) + "," + mysql.escape(userTime) + "," + mysql.escape(timeLapse) + "); " 
		+ "INSERT INTO QNosAndIDs (QuestionID, QuestionNo) "
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(questionNo) + ");"
		+ "INSERT INTO UserQuestionIDs (QuestionID, UserID) "
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(userID) + "); "
		+ "INSERT INTO Phq9Scores (QuestionID, Phq9Score) "
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(phq9Score) + ");"
		+ "INSERT INTO Phq9Totals (UserID, Phq9Total, DateCompleted) "
			+ "VALUES (" + mysql.escape(userID) + "," + mysql.escape(totalScore) + "," + mysql.escape(userTime) + ");",
				function(err, rowCount, rows){
					if(!err){
						console.log("All data successfully inserted into tables");
					}else{
						console.log("Error in inserting data" + err);
					}
				}
		);
		connection.execSql(request);
	}else{
	request = new Request(
		"INSERT INTO TimeStamps (QuestionID, BotMsgTime, UserMsgTime, TimeLapse) " 
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(botTime) + "," + mysql.escape(userTime) + "," + mysql.escape(timeLapse) + "); " 
		+ "INSERT INTO QNosAndIDs (QuestionID, QuestionNo) "
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(questionNo) + ");"
		+ "INSERT INTO UserQuestionIDs (QuestionID, UserID) "
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(userID) + "); "
		+ "INSERT INTO Phq9Scores (QuestionID, Phq9Score) "
			+ "VALUES (" + mysql.escape(questionID) + "," + mysql.escape(phq9Score) + ")",
				function(err, rowCount, rows){
					if(!err){
						console.log("All data successfully inserted into tables");
					}else{
						console.log("Error in inserting data" + err);
					}
				}
		);
		connection.execSql(request);
	}
}

function insertIntoUserResponses(userResponse){
	return new Promise(
		function(resolve, reject){
			request = new Request(
				"INSERT INTO UserResponsesNew (UserResponse) VALUES ('" + replaceSingleQuotes(userResponse) + "'); SELECT @@identity",
				function(err, rowCount, rows){
					if(!err){
						console.log("user response successfully inserted into UserResponsesNew");
					}else{
						console.log("Error in inserting into UserResponsesNews:" + err);
					}
				}
			);

			request.on('row', function(columns){
				console.log("new questionID in function is " + columns[0].value);
				returnSentiment(userResponse, columns[0].value);
				//returnKeywords(userResponse, columns[0].value);
				resolve(columns[0].value);
			});

			connection.execSql(request);
	});
}

function processUserResponseNew(session, results, questionNo){
		// Getting user response
		var userResponse = null;

		if(typeof results === 'string'){
			userResponse = results;
		}else{
			userResponse = results.response;
		}

		console.log("user response in processUserResponseNew is: " + userResponse);

		// Calculating time at which bot messaged
		var botTimeFormatted = getBotMsgTime(session);
		// Calculating time at which user responded
		var userTimeFormatted = getUserMsgTime(session);
		// Calculating time lapse between question raised and question answered
		var timeLapseHMS = getTimeLapse(session);

		builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
			function(err, intents, entities, compositeEntities){
				var qScore = 0;
				if(entities[0] != null){
					console.log(entities);
					var entity = entities[0].type;
					console.log("Entity recognised is %s", entities[0].type);

					qScore = getScore(entity);
					console.log("individual question score is " + qScore);

					totalScore+=getScore(entity);
					console.log("Total score after this question is %i", totalScore);
				}else{
					console.log("No entity identified");
					qScore = 0;
				}

				insertIntoUserResponses(userResponse)
					.then(function(qID){ 
						insertUserResponseData(qID, botTimeFormatted, userTimeFormatted, timeLapseHMS, questionNo, userID, userResponse, qScore, totalScore)
						
					})
					.catch(function(error){console.log("error in promise function catch statement" + error)});
			}
		);
}


bot.dialog('phq9', [
	function (session, args, next){
		console.log('Entering dialog phq9');
		session.send("I'm now going to ask you some questions about how you've felt over the past two weeks");
		next();
	},
	function(session){
		console.log("Asking phq9 q1");
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often have you had little interest or pleasure in doing things?");
	}, 
	function(session, results, next){ 
		var questionNo = 6;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		console.log("phq9 q2");
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often do you feel down, depressed, or hopeless?");
	},
	function(session, results, next){ 
		var questionNo = 7;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, 'How often have you had trouble falling or staying asleep, or sleeping too much?');
	},
	function(session, results, next){ 
		var questionNo = 8;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often have you been bothered by feeling tired or having little energy?");
	},
	function(session, results, next){ 
		var questionNo = 9;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often have you had a poor appetite or overeat?");
	}, 
	function(session, results, next){ 
		var questionNo = 10;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often have you felt bad about yourself - or that you are a failure or have let yourself or your family down?");
	}, 
	function(session, results, next){ 
		var questionNo = 11;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often have you had trouble concentrating on things, such as reading the newspaper or watching television?");
	}, 
	function(session, results, next){ 
		var questionNo = 12;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		builder.Prompts.text(session, "How often have you moved or spoken so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you've been moving around a lot more than usual?");
	}, 
	function(session, results, next){ 
		var questionNo = 13;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session, next){
		builder.Prompts.text(session, "How often have you had thoughts that you'd be better off dead or of hurting yourself in some way?");
	},
	function(session, results, next){ 
		var questionNo = 14;
		processUserResponseNew(session, results.response, questionNo);
		next();
	},
	function(session){
		var severity = getSeverity(totalScore);
		console.log("The user's score of %i indicates that the user has %s depression", totalScore, severity);
		session.endDialog('Thank you for completing these questions. Your score is %i. Please note that this score is provided to enable you to reflect on your situation; it in no way infers a medical diagnosis', totalScore);
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

function returnSentiment(text, qID){
	return sentimentService
				.getSentiment(text)
				.then(function(sentiment){ handleSentimentSuccessResponse(sentiment, qID); })
				.catch(function(error){ handleErrorResponse(error); });
}

function returnKeywords(text, qID){
	return keywordService
				.getKeywords(text)
				.then(function(keywords){ handleKeywordSuccessResponse(keywords, qID); })
				.catch(function(error){ handleErrorResponse(error); });
}


//====================
// Response Handling
//====================

function handleSentimentSuccessResponse(sentimentScore, qID){
	if(sentimentScore){
		console.log("Sentiment Analysis successful");
		insertIntoSentimentTable(sentimentScore, qID);
	}else{
		console.log("Sentiment score could not get result");
	}
}

function insertIntoSentimentTable(sentimentScore, questionID){

	request = new Request(
		"INSERT INTO Sentiment (QuestionID, SentimentScore) VALUES (" + mysql.escape(questionID) + "," + mysql.escape(sentimentScore) + ")",
				function(err, rowCount, rows){
					if(!err){
						console.log("Sentiment score successfully inserted into Sentiments table");
					}else{
						console.log("Error in inserting into Sentiments table:" + err);
					}
				}
	);
	connection.execSql(request);
}	

function insertKeywords(keyword, qID){
	request = new Request(
		"INSERT INTO Keywords (Keyword) VALUES (" + mysql.escape(keyword) + ") WHERE QuestionID = " + mysql.escape(qID),
			function(err, rowCount, rows){
				if(!err){
					console.log("Keyword" + mysql.escape(keyword) + " successfully inserted into table");
				}else{
					console.log("Error in inserting into Keywords table" + err);
				}
			}
	);
	connection.execSql(request);
}

function handleKeywordSuccessResponse(keywords, qID){
	if(keywords){
		console.log('Keywords returned result: ' + keywords);
		var keywordsSplit = keywords.toString().split(",");
		console.log(keywordsSplit);

		request = new Request(
		"INSERT INTO Keywords (Keyword) VALUES ('water') WHERE QuestionID = " + mysql.escape(qID),
			function(err, rowCount, rows){
				if(!err){
					console.log("Keyword" + mysql.escape(keyword) + " successfully inserted into table");
				}else{
					console.log("Error" + err);
				}
			}
	);
	connection.execSql(request);

		setTimeout(function(){
			for(i=0; i<keywordsSplit.length; i++){
				insertKeywords(keywordsSplit[i], qID);
			}
		}, 200);
	}else{
		console.log('Keywords could not be obtained');
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

//===================
// Helper Functions
//===================

//https://stackoverflow.com/questions/29816872/how-can-i-convert-milliseconds-to-hhmmss-format-using-javascript
function convertMsToHMS(ms){
	var ss = ms/1000;
	var ss = ms/1000;
	var hh = parseInt(ss/3600);
	ss = ss % 3600;
	var mm = parseInt(ss/60);
	ss = ss % 60;

	return(hh + ":" + mm + ":" + ss);
}


//==============================
// Unused or replaced Functions
//==============================

function insertIntoUserQuestionIDs(questionID, userID){
	request = new Request(
		"INSERT INTO UserQuestionsIDs (QuestionID, UserID) VALUES (" + mysql.escape(questionID) + "," + mysql.escape(userID) + ")",
		function(err){
			if(!err){
				console.log("Data successfully inserted into UserQuestionIDs table");
			}else{
				console.log("Error in inserting into UserQuestionIDs table:" + err);
			}
		}
	);
	connection.execSql(request);
}

function insertIntoQNosAndIDs(questionID, questionNo){
	request = new Request(
		"INSERT INTO QNosAndIDs (QuestionID, QuestionNo) VALUES (" + mysql.escape(questionID) + "," + mysql.escape(questionNo) + ")",
		function(err){
			if(!err){
				console.log("Data successfully inserted into QNosAndIDs table");
			}else{
				console.log("Error in inserting into QNosAndIDs:" + err);
			}
		}
	);
	connection.execSql(request);
}

function insertIntoPhq9Score(questionID, phq9Score){
	request = new Request(
		"INSERT INTO Phq9Scores (QuestionID, Phq9Score) VALUES (" + mysql.escape(questionID) + "," + mysql.escape(phq9Score) + ")",
		function(err){
			if(!err){
				console.log("Insert into Phq9Scores successful");
			}else{
				console.log("Error in inserting into Phq9Scores:" + err);
			}
		}
	);
	connection.execSql(request);
}

function insertIntoTimestamps(questionID, botTime, userTime, timeLapse){
	request = new Request(
		"INSERT INTO TimeStamps (QuestionID, BotMsgTime, UserMsgTime, TimeLapse) VALUES (" + mysql.escape(questionID) + "," + mysql.escape(botTime) + "," + mysql.escape(userTime) + "," + mysql.escape(timeLapse) + ")",
		function(err, rowCount, rows){
			if(!err){
				console.log("Time info about message successfully inserted into TimeStamps");
			}else{
				console.log("Error in inserting into TimeStamps" + err);
			}
		}
	);
	connection.execSql(request);
}

function storeUserResponse(session, questionNo, userID, userResponse, botMsgTimeFormatted, userMsgTimeFormatted, timeLapseHMS){
	console.log("Storing user response...");

	// Putting values into database
	request = new Request(
		"INSERT INTO UserResponses (QuestionNo, UserID, UserResponse, BotMsgTime, UserMsgTime, TimeLapse) VALUES (" + mysql.escape(questionNo) + "," + mysql.escape(userID) + ",'" + replaceSingleQuotes(userResponse) + "', " + mysql.escape(botMsgTimeFormatted) + ", " + mysql.escape(userMsgTimeFormatted) + ", " + mysql.escape(timeLapseHMS) + "); SELECT @@identity",
			function(err, rowCount, rows){
				if(!err){
					console.log("User response successfully inserted into table from function");
				}else{
					console.log("Error" + err);
				}
			}
	);

	// Calculating sentiment and extracting keywords
	//https://github.com/tediousjs/tedious/issues/117
	request.on('row', function(columns){
		console.log('new id: %d', columns[0].value);
		session.dialogData.qID = columns[0].value;
		var sentiment = returnSentiment(session, userResponse, session.dialogData.qID);
		var keywords = returnKeywords(session, userResponse, session.dialogData.qID);
	});
	connection.execSql(request);
}
