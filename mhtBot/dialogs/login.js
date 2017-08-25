//------------------//
// login Dialog
//------------------//

var builder = require('botbuilder');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var mysql = require('mysql');
var bcrypt = require('bcrypt');

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

var DialogLabels = {
	generalQs: 'generalQs',
};

bot.dialog('generalQs', require('../app'));

module.exports = [
	function(session){
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
					session.endDialog("Wecome back %s!", session.userData.username);
					session.beginDialog('generalQs');
					//session.beginDialog('gad7'); /* for testing */
				}else{
					console.log("Passwords do not match");
					session.send("I'm sorry, your password is incorrect. Please try logging in again");
					session.beginDialog('login');
				}
			});
		});
		connection.execSql(request);
	}
];
