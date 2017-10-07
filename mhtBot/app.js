//==============//
// npm Modules
//=============//

// Loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var sentimentService = require('./cogServices/sentiment-service');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// https://www.npmjs.com/package/dateformat
var dateFormat = require('dateformat');
var moment = require('moment');

var mysql = require('mysql');

var dateFormatLite = require('date-format-lite');

var bcrypt = require('bcrypt');

//============//
// Bot Setup
//============//

// Setup restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});

// Serve a static web page
/*server.get(/.*//*, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));*/


// Serve a static web page
server.get(/\/static\/?.*/, restify.serveStatic({
	directory: __mhtBot,
	'default': 'index.html'
}));


// ==============================//
// Connect to Azure SQL database
// ==============================//

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
		console.log(session.userData.username);
		if(session.userData.username == null){
			session.send('Hello!');
			session.beginDialog('greeting');
		}else{
			session.send("Hi " + session.userData.username + "!");
			session.beginDialog('generalQs');
			//session.beginDialog('phq9'); /* for testing */
		}
	}
]);

server.post('/api/messages', connector.listen());

//============
// Constants
//============

const saltRounds = 10;

//===================
// Global Variables
//===================

var totalScore = 0;

var questionID = 0;

var feeling = null;

// required for time
var local = false;

// to set session.delay() to make SMS messages come through in correct order.
var delayTime = 1000;


//=============
// Bot Dialogs
//=============

//-----------------------------//
// Logout Dialog - for testing
//-----------------------------//
bot.dialog('logout', [
	function(session, args, next){
		session.userData.userID = null;
		session.userData.username = null;
		session.userData.questionnaireID = null;
		session.delay(delayTime);
		session.endConversation("You are now logged out. Just come back and say hello when you'd like to speak again :)");
	}
]).triggerAction({
	matches: /^logout$/i
});

//------------------//
// Greeting Dialog
//------------------//
bot.dialog('greeting', [
	function(session, args, next){
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.confirm(session, "Are you already registered?");
	},
	function(session, results){
		session.sendTyping();
		session.delay(delayTime);
		var userResponse = results.response;
		if(userResponse == true){
			session.endDialog('Great, let\'s log you in');
			session.beginDialog('login');
		}else{
			session.send('No problem. Registering is quick and easy');
			session.userData.usernameValid = true;
			session.beginDialog('register');
		}
	}
]);

//------------------//
// Register Dialog
//------------------//
bot.dialog('register', [
	function(session, args, next){
		session.sendTyping();
		session.delay(delayTime);
		if(session.userData.usernameValid == true){
			builder.Prompts.text(session, "Please enter a username of your choice.");
		}else{
			builder.Prompts.text(session, "Please pick another username.");
		}
	},
	function(session, result, next){
		session.userData.username = result.response;
		console.log("Username entered was: " + session.userData.username);

		// Checks for illegal characters in entered username
		var checkSpaces = session.userData.username.includes(" ");
		console.log("Username entered included spaces: " + checkSpaces);

		var checkSingleQuotationMarks = session.userData.username.includes("'");
		console.log("Username entered included inverted commas: " + checkSingleQuotationMarks);

		// Handles username with illegal characters
		if(checkSpaces == true || checkSingleQuotationMarks == true){
			session.sendTyping();
			session.delay(delayTime);
			session.send("I'm sorry, usernames cannot have spaces or single quotation marks (') in them.");
			session.userData.usernameValid = false;
			session.beginDialog('register');
		}

		// Checks whether username already exists
		request = new Request(
			"SELECT UserID FROM Users WHERE Username = " + mysql.escape(session.userData.username), function(err, rowCount, rows){
				console.log("In query for Username");
				if(!err){
					console.log("Query on user table successfully executed");
					console.log(rowCount + " rows returned");
					if(rowCount>0){
						console.log("Username " + session.userData.username + " already exists in database");
						session.sendTyping();
						session.delay(delayTime);
						session.send("I'm sorry, that username is unavailable");
						session.userData.usernameValid = false;
						session.beginDialog('register');
					}else{
						console.log("Username " + session.userData.username + " does not already exist");
						next();
					}
				}else{
					console.log("An error occurred in checking whether the user exists in the database." + err);
				}
			}
		);
		connection.execSql(request);
	}, 
	function(session, result){
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "Thanks. Please enter a password of your choice.");
	},
	function(session, result){
		var plainTextPassword = result.response;

		bcrypt.genSalt(saltRounds, function(err, salt){
			bcrypt.hash(plainTextPassword, salt, function(err, hash){
				console.log(hash);
				request = new Request(
					"INSERT INTO Users (Username, Password) VALUES (" + mysql.escape(session.userData.username) + "," + mysql.escape(hash) + "); SELECT @@identity" + "",
						function(err, rowCount, rows){
							if(!err){
								console.log("User successfully inserted into table");
								session.sendTyping();
								session.delay(delayTime);
								session.send("Welcome " + session.userData.username + "! You've successfully registered.");
								session.beginDialog('generalQs');
								//session.beginDialog('gad7'); /* for testing */
							}else{
								console.log("Error" + err);
							}

						}
				);
				request.on('row', function(columns){
					console.log('Newly registered user id is: %d', columns[0].value);
					session.userData.userID = columns[0].value;
				});
				connection.execSql(request);
			});
		});
	}, 
]);

//------------------//
// Login Dialog
//------------------//
bot.dialog('login', [
	function(session){
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "Please enter your username:");
	},
	function(session,results, next){
		session.userData.username = results.response;
		console.log("Username entered was " + session.userData.username);

		request = new Request(
			"SELECT UserID FROM Users WHERE Username = " + mysql.escape(session.userData.username), function(err, rowCount, rows){
				console.log("In query for Username");
				if(!err){
					console.log("Query to check if username exists successfully executed");
					console.log(rowCount + " rows returned");
					if(rowCount>0){
						console.log("Username " + session.userData.username + " exists.");
						next();
					}else{
						console.log("Username " + session.userData.username + " does not exist");
						session.sendTyping();
						session.delay(delayTime);
						session.send("I'm sorry, I don't recognise that username. Please try logging in again.");
						session.beginDialog('login');
					}
				}else{
					console.log("An error occurred in checking whether this username exists." + err);
					//session.endDialog("User does not exist on system");
				}
			}
		);
		connection.execSql(request);
	},
	function(session){
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "Thanks. Now please enter your password.");
	},
	function(session, result){
		session.userData.password = result.response;
		var plainTextPassword = session.userData.password;

		request = new Request(
			"SELECT UserID, Password FROM Users WHERE Username =" +  mysql.escape(session.userData.username),
				function(err, rowCount, rows){
					if(!err){
						console.log("Query to retrieve UserID and Password from db successful.");
						console.log(rowCount + " rows returned.");
						if(rowCount>0){
							console.log("UserID and Password successfully retrieved from database");
						}else{
							console.log("No userID and password retrieved. This should not happen.");
						}
					}else{
						console.log("Error in retrieving UserID and Password from database: " + err);
				}
			}
		);

		request.on('row', function(columns){
			console.log("Logged in user userID is: " + columns[0].value);
			console.log("Password from db is: " + columns[1].value);

			var hash = columns[1].value;
			
			bcrypt.compare(plainTextPassword, hash, function(err, res){
				if(res === true){
					console.log("Password entered matches password stored in database");

					session.userData.password = columns[1].value;
					session.userData.userID = columns[0].value;

					console.log("User %s logged in.", session.userData.username);
					session.sendTyping();
					session.delay(delayTime);
					session.endDialog("Wecome back %s!", session.userData.username);
					session.beginDialog('generalQs');
					//session.beginDialog('gad7');  for testing 
				}else{
					console.log("Passwords do not match");
					session.sendTyping();
					session.delay(delayTime);
					session.send("I'm sorry, your password is incorrect. Please try logging in again");
					session.beginDialog('login');
				}
			});
		});
		connection.execSql(request);
	}
]);


//------------------//
//GeneralQs Dialog
//------------------//

bot.dialog('generalQs', [
	function(session, args, next){
		beginNewQuestionnaire(session, session.userData.userID, 'generalQs')
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, 'How are you?');
	},
	function(session, results, next){ 
		session.userData.lastMessageReceived = new Date();
		session.conversationData.userResponse = results.response;
		questionID = 1;

		recogniseFeeling(session.message.text)
			.then(function(feelingEntity){ 
				session.delay(delayTime);
				var botResponse = generateBotGeneralQResponse(feelingEntity);
				processGeneralQResponse(session, session.conversationData.userResponse, questionID, session.userData.questionnaireID);
				if(feeling == 'Happy'){
					session.sendTyping();
					session.delay(delayTime);
					session.send(botResponse);
					session.sendTyping();
					session.delay(delayTime);
					session.endConversation("I'll say goodbye for now " + session.userData.username + " but just say hello when you'd like to speak again :)");
				}else{
					session.sendTyping();
					session.delay(delayTime);
					session.send(botResponse + ".");
					next();
				}
			})
			.catch(function(error){
				processGeneralQResponse(session, session.conversationData.userResponse, questionID, session.userData.questionnaireID);
				console.log("No feeling identified" + error);
				session.beginDialog('clarifyFeeling');
			});
	},
	function(session, args, next){
		// https://stackoverflow.com/questions/42069081/get-duration-between-the-bot-sending-the-message-and-user-replying
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, 'What has led you to seek an assessment for how you\'re feeling?');
	}, 

	function(session, results, next){
		questionID = 3;
		session.userData.lastMessageReceived = new Date();
		session.conversationData.userResponse = results.response;
		processGeneralQResponse(session, results.response, questionID, session.userData.questionnaireID);
		session.sendTyping();
		session.delay(delayTime);
		session.send(generateBotGeneralQResponse2());
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, 'Can you identify anything in particular that might have triggered any negative thoughts and feelings?');
	},
	function(session, results, next){
		questionID = 4;
		session.userData.lastMessageReceived = new Date();
		session.conversationData.userResponse = results.response;
		processGeneralQResponse(session, session.conversationData.userResponse, questionID, session.userData.questionnaireID);
		session.sendTyping();
		session.delay(delayTime);
		session.send(generateBotGeneralQResponse2());
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, 'What have these thoughts and feelings stopped you doing?');
	},
	function(session, results, next){
		questionID = 5;
		session.userData.lastMessageReceived = new Date();
		session.conversationData.userResponse = results.response;
		processGeneralQResponse(session, session.conversationData.userResponse, questionID, session.userData.questionnaireID);
		session.sendTyping();
		session.delay(delayTime);
		session.send(generateBotGeneralQResponse2());
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.confirm(session, 'Do you have a care plan? If you don\'t know what a care plan is, please answer \'No\'.');
	},
	function(session, results, next){
		var userResponse = results.response;
		questionID = 6;
		session.userData.lastMessageReceived = new Date();
		processGeneralQResponse(session, session.message.text, questionID, session.userData.questionnaireID);
		session.sendTyping();
		session.delay(delayTime);
		session.send(generateBotGeneralQResponse2());
		if(userResponse == true){
			session.userData.lastMessageSent = new Date();
			session.sendTyping();
			session.delay(delayTime);
			builder.Prompts.text(session, 'Is it working for you?');
		}else{
			next();
		}
	},
	function(session, results, next){
		questionID = 7;
		session.userData.lastMessageReceived = new Date();
		processGeneralQResponse(session, session.message.text, questionID, session.userData.questionnaireID);
		session.sendTyping();
		session.delay(delayTime);
		session.send("Thank you for answering these questions " + session.userData.username + ".");
		next();
	},
	function(session){
		if(feeling == 'Depressed' || feeling == 'DepressedAndAnxious'){
			session.beginDialog('phq9');
		}else{
			session.beginDialog('gad7');
		}
	}
]);

//-----------------------//
// clarifyFeeling Dialog
//----------------------//

bot.dialog('clarifyFeeling', [
	function(session){
		console.log("Beginning 'clarifyFeeling' dialog");
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "To work out how to best help you, would you be able to be able to tell me if you're mostly feeling low, or anxious, or happy?");
	},
	function(session, results, next){
		session.conversationData.userResponse = results.response;

		recogniseFeeling(session.message.text)
			.then(function(feelingEntity){ 
				var botResponse = generateBotGeneralQResponse(feelingEntity);
				console.log(feelingEntity);
				console.log("Bot response is:");
				console.log(botResponse);
				if(feelingEntity == 'Happy'){
					session.sendTyping();
					session.delay(delayTime);
					session.send(botResponse);
					session.sendTyping();
					session.delay(delayTime);
					session.endConversation("I'll say goodbye for now " + session.userData.username + " but just say hello when you'd like to speak again :)");
				}else{
					session.sendTyping();
					session.delay(delayTime);
					session.send("Thank you for telling me this. " + botResponse + " though.");
					next();
				}
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyFeeling');
			});
	},
	function(session, results, next){
		questionID = 2;
		session.userData.lastMessageReceived = new Date();
		processGeneralQResponse(session, session.conversationData.userResponse, questionID, session.userData.questionnaireID)
		next();
	},
	function(session){
		session.endDialog();
	}
]);

//---------------------------//
// clarifyDifficulty Dialog
//---------------------------//
bot.dialog('clarifyDifficulty', [
	function(session){
		console.log("Beginning 'clarifyDifficult' dialog");
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "I'm sorry, I didn't quite get that. Would you say these problems have made these areas of your life: somewhat difficult, very difficult, extremely difficult, or not difficult at all?");
	},
	function(session, results, next){
		recogniseDifficultyEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.conversationData.userResponse = results.response;
				session.sendTyping();
				session.delay(delayTime);
				session.send("Thank you.");
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified " + error);
				session.beginDialog('clarifyDifficulty');
			});
	},
	function(session){
		session.endDialog();
	}
]);

//--------------------//
// clarifyDays Dialog
//--------------------//
bot.dialog('clarifyDays', [
	function(session){
		console.log("Beginning 'clarifyDays' dialog");
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "I'm sorry, I didn't quite get that. Please try and give a specific number of days.");
	},
	function(session, results, next){
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.conversationData.userResponse = results.response;
				session.sendTyping();
				session.delay(delayTime);
				session.send("Thank you");
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session){
		session.endDialog();
	}
]);

//------------------//
// phq9 Dialog
//------------------//
bot.dialog('phq9', [
	function (session, args, next){
		console.log('Beginning phq9 dialog');
		totalScore = 0;
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.confirm(session, "I'm now going to take you through a clinical process that will help you to explain how you feel to a clinician. Is that ok?");
		//session.send("I'm now going to ask you some questions about how you've felt over the past two weeks");
	},
	function(session, results, next){
		var userResponse = results.response;
		if(userResponse == true){
			session.sendTyping();
			session.delay(delayTime);
			session.send("Great!");
			next();
		}else{
			session.delay(delayTime);
			session.endDialog("No problem!" + session.userData.username + "Come back when you feel ready to try this.");
		}
	}, 
	function(session){
		beginNewQuestionnaire(session, session.userData.userID, 'phq9');
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you had little interest or pleasure in doing things?");
	}, 
	function(session, results, next){ 
		//session.dialogData.userResponse = results.response;
		recogniseDayEntity(results.response)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.delay(delayTime);
				session.sendTyping();
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){
		questionID = 8;
		session.userData.lastMessageReceived = new Date();
		console.log("Current questionnaireID is: " + session.userData.questionnaireID);
		session.delay(delayTime);
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	}, 
	function(session, next){
		console.log("phq9 q2");
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you felt down, depressed, or hopeless?");
	},
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, 'In the past two weeks, how many days have you had trouble falling or staying asleep, or sleeping too much?');
	},
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days were you bothered by feeling tired or having little energy?");
	},
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you had a poor appetite or overeaten?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you felt bad about yourself - or that you are a failure or have let yourself or your family down?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you had trouble concentrating on things, such as reading the newspaper or watching television?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you moved or spoken so slowly that other people could have noticed? Or the opposite - been so fidgety or restless that you've been moving around a lot more than usual?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},

	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you had thoughts that you'd be better off dead or of hurting yourself in some way?");
	},
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "How difficult have any of these problems made it for you to do your work, take care of things at home, or get along with other people?");
	},
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDifficultyEntity(session.message.text)
			.then(function(entity){ 
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDifficulty');
			});
	},
	function(session, results, next){
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processDifficultyResponse(session, session.conversationData.userResponse, 'phq9', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, results, next){
		var severity = getSeverity(totalScore);
		console.log("The user's score of %i indicates that the user has %s depression", totalScore, severity);
		session.sendTyping();
		session.delay(delayTime);
		session.send('Thank you for answering these questions ' + session.userData.username + '. You\'ve just been through the PHQ-9 questionnaire. Your score is %i, which will be useful for a clinician. Please do this questionnaire regularly and, if after two weeks you don\'t feel any better, please share your score and your responses with a clinician. Your data is available at the [MhtBot:Data](http://mhtbotdbaccess.azurewebsites.net) site.', totalScore);
		next();
	},
	function(session){
		if(feeling == 'Depressed'){
			session.sendTyping();
			session.delay(delayTime);
			session.endConversation("I'll say goodbye for now " + session.userData.username + ". Just come back and say hello when you'd like to chat again :)");
		}else if(feeling == 'DepressedAndAnxious'){
			session.beginDialog('gad7');
		}
	},
]);

//------------------//
// gad7 Dialog
//------------------//
bot.dialog('gad7', [
	function (session, args, next){
		console.log('Beginning gad7 dialog');
		totalScore = 0;
		session.sendTyping();
		session.delay(delayTime);
		if(feeling == 'Anxious'){
			builder.Prompts.confirm(session, "I'm now going to take you through a clinical process that will help you to explain how you feel to a clinician. Is that ok?");
		}else{
			builder.Prompts.confirm(session, "There's another clinical process that could also help you. Would you like to do this one as well?");
		}
	},
	function(session, results, next){
		var userResponse = results.response;
		session.sendTyping();
		session.delay(delayTime);
		if(userResponse == true){
			session.send("That's great!");
			next();
		}else{
			session.endConversation("No problem, just come back and say hello when you feel ready to try this. Hope to speak to you again soon " + session.userData.username + "!");
		}
	},
	function(session){
		beginNewQuestionnaire(session, session.userData.userID, 'gad7');
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you felt nervous, anxious, or on edge?");
	}, 
	function(session, results, next){ 

		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified" + error);
				session.beginDialog('clarifyDays');
			});
	},
	function(session, results, next){ 
		questionID = 18;
		console.log("questionnaire ID identified is");
		console.log(session.userData.questionnaireID);
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you not been able to stop or control worrying?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next(); })
			.catch(function(error){ console.log("No entities identified" + error);
				session.beginDialog('clarifyDays'); });
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you worried too much about different things?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.conversationData.userResponse = results.response;
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				next(); })
			.catch(function(error){ console.log("No entities identified" + error);
				session.beginDialog('clarifyDays'); });
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you had trouble relaxing?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next(); })
			.catch(function(error){ console.log("No entities identified" + error);
				session.beginDialog('clarifyDays'); });
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you been so restless that it's been hard to sit still?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next(); })
			.catch(function(error){ console.log("No entities identified" + error);
				session.beginDialog('clarifyDays'); });
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you become easily annoyed or irritable?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next(); })
			.catch(function(error){ console.log("No entities identified" + error);
				session.beginDialog('clarifyDays'); });
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "In the past two weeks, how many days have you felt afraid, as if something awful might happen?");
	}, 
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDayEntity(session.message.text)
			.then(function(entity){ 
				var botResponse = generateBotQuestionnaireResponse(entity);
				session.sendTyping();
				session.delay(delayTime);
				session.send(botResponse);
				session.conversationData.userResponse = results.response;
				next(); })
			.catch(function(error){ console.log("No entities identified" + error);
				session.beginDialog('clarifyDays'); 
			});
	},
	function(session, results, next){ 
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processQuestionnaireResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},

	function(session, next){
		session.userData.lastMessageSent = new Date();
		session.sendTyping();
		session.delay(delayTime);
		builder.Prompts.text(session, "How difficult have any of these problems made it for you to do your work, take care of things at home, or get along with other people?");
	},
	function(session, results, next){ 
		session.dialogData.userResponse = results.response;
		recogniseDifficultyEntity(session.message.text)
			.then(function(entity){ 
				session.conversationData.userResponse = results.response;
				next();
			})
			.catch(function(error){ 
				console.log("No entities identified " + error);
				session.beginDialog('clarifyDifficulty');
			});
	},
	function(session, results, next){
		questionID += 1;
		session.userData.lastMessageReceived = new Date();
		processDifficultyResponse(session, session.conversationData.userResponse, 'gad7', questionID, session.userData.questionnaireID);
		next();
	},
	function(session, results, next){
		var severity = getSeverity(totalScore);
		console.log("The user's score of %i indicates that the user has %s anxiety", totalScore, severity);
		session.sendTyping();
		session.delay(delayTime);
		session.send('Thanks for answering these questions ' + session.userData.username + '. You\'ve just been through the GAD-7 questionnaire. Your score is %i, which will be useful for a clinician. Please do this questionnaire regularly and, if after two weeks you don\'t feel any better, please share your score and your responses with a clinician. Your data is available at the [MhtBot:Data](http://mhtbotdbaccess.azurewebsites.net) site.', totalScore);
		next();
	},
	function(session){
		session.sendTyping();
		session.delay(delayTime);
		session.endConversation("I'll say goodbye for now " + session.userData.username + " but just say hello when you'd like to talk again :)");
	},
]);


//============//
// Functions
//============//

//-----------------------------//
// Miscellaneous Functions
//----------------------------//

function replaceSingleQuotes(str){
	str = str.replace("'", "''");
	console.log(str);
	return str;
}

//----------------------------------//
// Generate Bot Response Functions
//---------------------------------//

function generateBotGeneralQResponse(feeling){
	console.log("In generateBotGeneralResponse() dialog");
	if(feeling == 'Depressed' || feeling == 'Anxious' || feeling == 'DepressedAndAnxious'){
		return "I'm sorry to hear you're feeling that way";
	}else if(feeling == 'Happy'){
		return "That's great to hear! Think about what made you happy and do it again.";
	}else{
		return "Thank you.";
	}
}

function generateBotGeneralQResponse2(){
	return "Thanks."
}

function generateBotQuestionnaireResponse(entity){
	if(entity == 'NotAtAll'){
		return "That's great! I'm so glad to hear that.";
	}else{
		return "Thank you.";
	}
}

//------------------//
// Time Functions
//------------------//
function getBotMsgTime(session){
	console.log("getBotMsgTime() executing");
	var botTime = new Date(session.userData.lastMessageSent);
	console.log("Bot time unformatted is:");
	console.log(botTime);

	var botTimeFormatted = dateFormat(botTime, "yyyy-mm-dd HH:MM:ss");

	console.log("Bot messaged at: " + botTimeFormatted);
	return botTimeFormatted;
}

function getUserMsgTime(session){
	console.log("getUserMsgTime() executing");
	var userTime = new Date(session.userData.lastMessageReceived);
	console.log("User unformatted is:");
	console.log(userTime);

	var userTimeFormatted = dateFormat(userTime, "yyyy-mm-dd HH:MM:ss");
	console.log("User time formatted:" + userTimeFormatted);

	return userTimeFormatted;
}

function getTimeLapse(session){
	console.log("getTimeLapse() executing");
	var botTime = new Date(session.userData.lastMessageSent);
	var userTime = new Date(session.message.localTimestamp);
	var userTimeManual = new Date(session.userData.lastMessageReceived);
	console.log("Time Lapse Info:");
	var timeLapseMs = userTimeManual - botTime;
	console.log("Time lapse in ms is: " + timeLapseMs);
	var timeLapseHMS = convertMsToHMS(timeLapseMs);
	console.log("Time lapse in HH:MM:SS: " + timeLapseHMS);
	return timeLapseHMS;
}

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



function beginNewQuestionnaire(session, userID, questionnaireType){
	return new Promise(
		function(resolve, reject){
			request = new Request(
				"INSERT INTO Questionnaires (UserID, QuestionnaireType) VALUES (" + userID + ", '" + questionnaireType + "'); SELECT @@identity",
				function(err){
					if(!err){
						console.log("Successful insert into Questionnaires");
					}else{
						console.log("Error in inserting into Questionnaires. " + err);
					}
				}
				);

			request.on('row', function(columns){
				console.log("New questionnaireID is: " + columns[0].value);
				session.userData.questionnaireID = columns[0].value;
				resolve(columns[0].value);
			});
			connection.execSql(request);
		});
}

//----------------------------//
// Process Response Functions
//---------------------------//

function processGeneralQResponse(session, response, questionID, questionnaireID){
	// Gets timestamp information
	var botTimeFormatted = new Date(getBotMsgTime(session));
	var userTimeFormatted = new Date(getUserMsgTime(session));
	var timeLapseHMS = getTimeLapse(session);

	// inserts data into UserReponses table 
	insertIntoUserResponses(response)
		// Using the interactionID created by the insertion, inserts the user response data into the other relevant tables
		.then(function(interactionID){ 
			insertGeneralQResponseData(interactionID, botTimeFormatted, userTimeFormatted, timeLapseHMS, questionID, session.userData.userID, response, questionnaireID)
			
		})
		.catch(function(error){console.log("Error in insertIntoUserResponses() promise function. Now in catch statement " + error)});
}

function processQuestionnaireResponse(session, results, questionnaireType, questionID, questionnaireID){
	console.log("Executing processQuestionnaireResponse()");
	var userResponse = results;
	var botTimeFormatted = new Date(getBotMsgTime(session));
	var userTimeFormatted = new Date(getUserMsgTime(session));
	var timeLapseHMS = getTimeLapse(session);

	builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
		function(err, intents, entities, compositeEntities){
			console.log("Now in LUIS Recognizer in processQuestionnaireResponse() function");
			var qScore = 0;

			console.log("Intents and confidence scores identified are:");
			console.log(intents);
			console.log("Intent with highest certainty is:");
			console.log(intents[0]);
			console.log("Entities identified are:");
			console.log(entities);

			if(intents[0] != null && intents[0].intent == 'Days' && entities[0] !=null){
				console.log("Intent is \'Days\' and a relevant entity has been identified");
				console.log("Highest confidence entity identified is:"); 
				console.log(entities[0]);

				var entity = entities[0].type;
				console.log("Entity recognised is: %s", entities[0].type);

				qScore = getScore(entity);
				console.log("individual question score is: " + qScore);

				totalScore+=getScore(entity);
				console.log("Total score after this question is %i", totalScore);
			}else{
				console.log("One of the following occured: no intents identified; intent identified was not 'Days'; no entities were identified");
				qScore = 0;
			}

			insertIntoUserResponses(userResponse)
				.then(function(interactionID){ 
					insertQuestionnaireResponseData(interactionID, botTimeFormatted, userTimeFormatted, timeLapseHMS, questionID, session.userData.userID, userResponse, questionnaireType, qScore, questionnaireID)
					
				})
				.catch(function(error){console.log("Error in insertIntoUserResponses() promise in processQuestionnaireResponse(). Now in catch statement. " + error)});
		}
	);
}

function processDifficultyResponse(session, results, questionnaireType, questionID, questionnaireID){
	var userResponse = results;
	var botTimeFormatted = new Date(getBotMsgTime(session));
	var userTimeFormatted = new Date(getUserMsgTime(session));
	var timeLapseHMS = getTimeLapse(session);

	builder.LuisRecognizer.recognize(session.message.text, process.env.LUIS_MODEL_URL,
		function(err, intents, entities, compositeEntities){
			console.log("Now in recogniseDifficultyEntity() function");

			console.log("Intents and confidence scores identified are:");
			console.log(intents);
			console.log("Intent with highest confidence score is:");
			console.log(intents[0]);
			console.log("Entities identified are:");
			console.log(entities);

			if(intents[0] != null && intents[0].intent == 'Difficulty' && entities[0] != null){
				console.log("Intent is 'Difficulty' and a relevant entity has been identified");
				console.log("Highest confidence entity identified is:");
				console.log(entities[0]);

				var difficultyEntity = entities[0].type;
				console.log("Entity recognised is: %s:", entities[0].type);

				console.log("Final total score is after this question is %i", totalScore);
			}else{
				console.log("One of the following occured: no intents identified; intentt identified was not 'Difficulty'; no entities were identified");
			}

			insertIntoUserResponses(userResponse)
			.then(function(interactionID){ 
				insertQuestionnaireEndData(interactionID, botTimeFormatted, userTimeFormatted, timeLapseHMS, questionID, session.userData.userID, userResponse, questionnaireType, 0, totalScore, difficultyEntity, questionnaireID);
				
			})
			.catch(function(error){
				console.log("In processDifficultyResponse() catch statement. Error: " + error)
			});
		}
	);
}

//----------------------------//
// Database Insert Functions
//---------------------------//

function insertIntoUserResponses(userResponse){
	console.log("executing insertIntoUserResponse()");
	return new Promise(
		function(resolve, reject){
			request = new Request(
				"INSERT INTO UserResponses (UserResponse) VALUES ('" + replaceSingleQuotes(userResponse) + "'); SELECT @@identity",
				function(err, rowCount, rows){
					if(!err){
						console.log("user response successfully inserted into UserResponses");
					}else{
						console.log("Error in inserting into UserResponsesNews:" + err);
					}
				}
			);

			request.on('row', function(columns){
				console.log("new interactionID in function is " + columns[0].value);
				returnSentiment(userResponse, columns[0].value);
				//returnKeywords(userResponse, columns[0].value);
				resolve(columns[0].value);
			});

			connection.execSql(request);
	});
}


function insertGeneralQResponseData(interactionID, botTime, userTime, timeLapse, questionID, userID, userResponse, questionnaireID){
	console.log("InteractionID: " + interactionID);
	console.log("BotTime: " + botTime);
	console.log("UserTime: " + userTime);
	console.log("TimeLapse: " + timeLapse);
	console.log("QuestionID: " + questionID);
	console.log("UserID: " + userID);
	console.log("UserResponse: " + userResponse);
	//console.log("QuestionnaireType: " + questionnaireType);
	//console.log("qScore: " + qScore);
	console.log("questionnaireID " + questionnaireID);

	request = new Request(
		"INSERT INTO Timestamps (InteractionID, BotMsgTime, UserMsgTime, TimeLapse) " 
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(botTime) + "," + mysql.escape(userTime) + "," + mysql.escape(timeLapse) + "); " 
		+ "INSERT INTO InteractionQuestionIDs (InteractionID, QuestionID) "
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(questionID) + ");"
		+ "INSERT INTO UserInteractions (InteractionID, UserID) "
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(userID) + "); "
		+ "INSERT INTO QuestionScores(QuestionnaireID, InteractionID, Score) "
			+ "VALUES (" + questionnaireID + "," + mysql.escape(interactionID) + "," + 0 + ");",
				function(err, rowCount, rows){
					if(!err){
						console.log("Data succesfully inserted into tables: Timestamps, InteractionQuestionIDs, UserInteractions");
					}else{
						console.log("Error in insertGeneralQResponseData() query. " + err);
					}
				}
		);
		connection.execSql(request);
}


function insertQuestionnaireResponseData(interactionID, botTime, userTime, timeLapse, questionID, userID, userResponse, questionnaireType, qScore, questionnaireID){
	console.log("InteractionID: " + interactionID);
	console.log("BotTime: " + botTime);
	console.log("UserTime: " + userTime);
	console.log("TimeLapse: " + timeLapse);
	console.log("QuestionID: " + questionID);
	console.log("UserID: " + userID);
	console.log("UserResponse: " + userResponse);
	console.log("QuestionnaireType: " + questionnaireType);
	console.log("qScore: " + qScore);
	console.log("questionnaireID " + questionnaireID);
	request = new Request(
		"INSERT INTO Timestamps (InteractionID, BotMsgTime, UserMsgTime, TimeLapse) " 
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(botTime) + "," + mysql.escape(userTime) + "," + mysql.escape(timeLapse) + "); " 
		+ "INSERT INTO InteractionQuestionIDs (InteractionID, QuestionID) "
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(questionID) + ");"
		+ "INSERT INTO UserInteractions (InteractionID, UserID) "
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(userID) + "); "
		+ "INSERT INTO QuestionScores(QuestionnaireID, InteractionID, Score) "
			+ "VALUES (" + questionnaireID + "," + mysql.escape(interactionID) + "," + mysql.escape(qScore) + ");",
				function(err, rowCount, rows){
					if(!err){
						console.log("Questionnaire user response data successfully inserted into tables: Timestamps, InteractionQuestionIDs, UserInteractions, QuestionScores, TotalScores");
					}else{
						console.log("Error in inserting questionnaire response data." + err);
					}
				}
	);
	connection.execSql(request);
}

function insertQuestionnaireEndData(interactionID, botTime, userTime, timeLapse, questionID, userID, userResponse, questionnaireType, qScore, totalScore, difficultyEntity, questionnaireID){
	console.log("In insertQuestionnnaireEndData()");
	console.log("QuestionnaireID is: " + questionnaireID);
	request = new Request(
		"INSERT INTO Timestamps (InteractionID, BotMsgTime, UserMsgTime, TimeLapse) " 
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(botTime) + "," + mysql.escape(userTime) + "," + mysql.escape(timeLapse) + "); " 
		+ "INSERT INTO InteractionQuestionIDs (InteractionID, QuestionID) "
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(questionID) + ");"
		+ "INSERT INTO UserInteractions (InteractionID, UserID) "
			+ "VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(userID) + "); " 
		+ "INSERT INTO QuestionScores(QuestionnaireID, InteractionID, Score) "
			+ "VALUES (" + questionnaireID + "," + mysql.escape(interactionID) + "," + mysql.escape(qScore) + ");"
		+ "INSERT INTO Difficulty (QuestionnaireID, Difficulty) " +
		  	"VALUES (" + questionnaireID + ",' " + difficultyEntity + "');" +
		  "INSERT INTO TotalScores (QuestionnaireID, TotalScore, DateCompleted) " +
		  	"VALUES ('" + mysql.escape(questionnaireID) + "'," + mysql.escape(totalScore) + ","  + mysql.escape(userTime) + ");",
				function(err, rowCount, rows){
					if(!err){
						console.log("Completed questionnaire user response data successfully inserted into tables: Timestamps, InteractionQuestionIDs, UserInteractions, Difficulty, TotalScores");
					}else{
						console.log("Error in inserting questionnaire end data. " + err);
					}
				}
	);
	connection.execSql(request);
}

function insertIntoSentimentTable(sentimentScore, interactionID){

	request = new Request(
		"INSERT INTO Sentiment (InteractionID, SentimentScore) VALUES (" + mysql.escape(interactionID) + "," + mysql.escape(sentimentScore) + ")",
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

//----------------------------------//
// Recognise LUIS Entity Functions
//--------------------------------//

function recogniseFeeling(text){
	return new Promise(
		function(resolve, reject){
			builder.LuisRecognizer.recognize(text, process.env.LUIS_MODEL_URL,
				function(err, intents, entities, compositeEntities){
					if(!err){
						console.log("Now in recogniseFeeling() function");

						console.log("Intents and confidence scores identified are:");
						console.log(intents);
						console.log("Intent with highest confidence score is:");
						console.log(intents[0]);
						console.log("Entities identified are:");
						console.log(entities);

						var depressed = false;
						var anxious = false;
						var happy = false;

						console.log("Number of entities identified");
						console.log(entities.length);

						//if(intents[0] != null && intents[0].intent = 'Feeling' && entities

						if(intents[0]!=null && entities[0]!=null){
							console.log("At least one intent and entity have been identified");

							for(i=0; i<entities.length; i++){
								if(entities[i].type == 'Depressed'){
									depressed = true;
									console.log("'Depressed' entity recognised");
								}else if(entities[i].type == 'Anxious'){
									anxious = true;
									console.log("'Anxious' entity recognised");
								}else if(entities[i].type == 'Happy'){
									happy = true;
									console.log("'Happy' entity recognised");
								}
							}

							if(depressed == true && anxious == true){
								feeling = 'DepressedAndAnxious';
								console.log("Global variable 'feeling' set to 'DepressedAndAnxious'");
							}else if(depressed == true){
								feeling = 'Depressed';
								console.log("Global variable 'feeling' set to 'Depressed'");
							}else if(anxious == true){
								feeling = 'Anxious';
								console.log("Global variable 'feeling' set to 'Anxious'");
							}else if(happy == true){
								feeling = 'Happy';
								console.log("Global variable 'feeling' set to 'Happy'");
							}

							resolve(feeling);

						}else{
							console.log("One of the following occured: no intents identified; no entities were identified");
							reject();
						}
					}else{
							console.log("Error in recogniseFeeling()" + err);
					}
				}
			);
		}
	);
}

function recogniseDayEntity(text){
	return new Promise(
		function(resolve, reject){
			builder.LuisRecognizer.recognize(text, process.env.LUIS_MODEL_URL,
				function(err, intents, entities, compositeEntities){
					console.log("Now in LUIS Recogniser in recogniseDayEntity() function");
					var qScore = 0;

					console.log("Intents and confidence scores identified are:");
					console.log(intents);
					console.log("Intent with highest confidence score is:");
					console.log(intents[0]);
					console.log("Entities identified are:");
					console.log(entities);

					if(intents[0] != null && intents[0].intent == 'Days' && entities[0] !=null){
						console.log("Intent is 'Days' and a relevant entity has been identified");
						console.log("Highest confidence entity identified is:"); 
						console.log(entities[0]);

						var entity = entities[0].type;
						console.log("Entity recognised is: %s", entities[0].type);

						resolve(entity);
					}else{
						console.log("One of the following occured: no intents identified; intent identified was not 'Days'; no entities were identified");
						qScore = 0;
						reject();
					}
				});
		});
}

function recogniseDifficultyEntity(text){
	return new Promise(
		function(resolve, reject){
			builder.LuisRecognizer.recognize(text, process.env.LUIS_MODEL_URL,
				function(err, intents, entities, compositeEntities){
					console.log("Now in recogniseDifficultyEntity() function");
					var qScore = 0;

					console.log("Intents and confidence scores identified are:");
					console.log(intents);
					console.log("Intent with highest confidence score is:");
					console.log(intents[0]);
					console.log("Entities identified are:");
					console.log(entities);

					if(intents[0] != null && intents[0].intent == 'Difficulty' && entities[0] != null){
						console.log("Intent is 'Difficulty' and a relevant entity has been identified");
						console.log("Highest confidence entity identified is:");
						console.log(entities[0]);

						var entity = entities[0].type;
						console.log("Entity recognised is: %s:", entities[0].type);

						resolve(entity);
					}else{
						console.log("One of the following occured: no intents identified; intentt identified was not 'Difficulty'; no entities were identified");
						qScore = 0;
						reject();
					}
				}
			);
		}
	);
}


//----------------------//
// Scoring Functions
//--------------------//

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


//------------------------------//
// Sentiment Analysis Functions
//-----------------------------//

function returnSentiment(text, qID){
	return sentimentService
				.getSentiment(text)
				.then(function(sentiment){ handleSentimentSuccessResponse(sentiment, qID); })
				.catch(function(error){ handleErrorResponse(error); });
}

function handleSentimentSuccessResponse(sentimentScore, interactionID){
	if(sentimentScore){
		console.log("Sentiment Analysis successful");
		insertIntoSentimentTable(sentimentScore, interactionID);
	}else{
		console.log("Sentiment score could not get result");
	}
}

function handleErrorResponse(session, error){
	var clientErrorMessage = 'Oops! Something went wrong. Try again later.';
    if (error.message && error.message.indexOf('Access denied') > -1) {
        clientErrorMessage += "\n" + error.message;
    }

    console.error(error);
    //session.send(clientErrorMessage);
}

//===================
// Helper Functions
//===================




