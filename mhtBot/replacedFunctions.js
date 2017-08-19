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


function processUserResponse(session, results, questionNo){
		// Getting user response
		var userResponse = null;

		if(typeof results === 'string'){
			userResponse = results;
		}else{
			userResponse = results.response;
		}

		// Calculating time at which bot messaged
		//var botTimeFormatted = new Date(getBotMsgTime(session));
		var botTimeFormatted = new Date(getBotMsgTime(session));

		// Calculating time at which user responded
		//var userTimeFormatted = new Date(getUserMsgTime(session));
		var userTimeFormatted = new Date(getUserMsgTime(session));

		// Calculating time lapse between question raised and question answered
		var timeLapseHMS = getTimeLapse(session);

		var questionNo = questionNo;

		storeUserResponse(session, questionNo, userID, userResponse, botTimeFormatted, userTimeFormatted, timeLapseHMS);
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