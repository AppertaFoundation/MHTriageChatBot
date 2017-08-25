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


