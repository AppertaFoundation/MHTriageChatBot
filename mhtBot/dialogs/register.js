//------------------//
// register Dialog
//------------------//

var builder = require('botbuilder');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var mysql = require('mysql');
var bcrypt = require('bcrypt');

const saltRounds = 10;

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
			console.log("Connection successful");
		}
	}
);

module.exports = [
	function(session, args, next){
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
];
