//==============================
// Unused or replaced Functions
//==============================

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
