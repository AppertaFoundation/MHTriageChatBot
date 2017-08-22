<?php
function formatErrors( $errors )
{
    //Display errors. 
    echo "Error information: ";

    foreach ( $errors as $error )
    {
        echo "SQLSTATE: ".$error['SQLSTATE']."";
        echo "Code: ".$error['code']."";
        echo "Message: ".$error['message']."";
    }
}

function getAllUsernames($conn){
	$usernameArr = [];
	$tsql = "SELECT UserName FROM Users;";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE)
		die("Error in executing getAllUsers() query <br>");
	
	echo "getAllUsers() query successfully executed <br>";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		array_push($usernameArr, $row['UserName']);
	}
	return $usernameArr;
}

function getAllUserIDs($conn){
	$userIDs = [];
	$tsql = "SELECT UserID FROM Users;";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == False){
		if( ($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getAllUserIDs() query");
	}

	//echo "getAllUserIDs() successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		array_push($userIDs, $row['UserID']);
	}
	return $userIDs;
}

function getUsernameFromID($conn, $userID){
	$result = 0;
	$tsql = "SELECT Username FROM Users WHERE UserID = $userID";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == False){
		if( ($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getUsernameFromID() query");
	}

	//echo "getUserNameFromID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['Username'];
	}
	return $result;
}

function getUserID($conn, $username){
	$userID = 0;
	$tsql = "SELECT UserID FROM Users WHERE UserName = '" . $username . "';";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE){
		if( ($errors = sqlsrv_errors() ) != null) {
        foreach( $errors as $error ) {
            echo "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
            echo "code: ".$error[ 'code']."<br />";
            echo "message: ".$error[ 'message']."<br />";
        }
		die("Error in executing getUserID() query");
		}
	}

	echo "getUserID() query successfully executed <br>";
	$userID = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)['UserID'];
	return $userID;
}

function getUserResponses($conn, $userID){
	$userResponses = [];
	$tsql = "SELECT u.UserResponse FROM UserResponsesNew u JOIN UserQuestionIDs q ON u.QuestionID = q.QuestionID WHERE UserID = $userID;";

	$getResults = sqlsrv_query($conn, $tsql);  
	if($getResults == False){
		if( ($errors = sqlsrv_errors() ) != null) {
	        foreach( $errors as $error ) {
	            echo "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
	            echo "code: ".$error[ 'code']."<br />";
	            echo "message: ".$error[ 'message']."<br />";
			}
		die("Error in executing getUserResponses() query");
		}
	}
	echo "getUserResponses() query successfully executed <br>";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		echo $row['UserResponse'];
		array_push($userResponses, $row['UserResponse']);
	}
	return $userResponses;
}

function getQuestions($conn){
	$questions = array();
	$tsql = "SELECT Question FROM AllQuestions;";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getQuestions() query");
	}

	echo "getQuestions() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		array_push($questions, $row['Question']);
	}
	return $questions;
}

function getUserResponsesIDs($conn, $userID){
	$result = array();
	$tsql = "SELECT QuestionID FROM UserQuestionIDs WHERE UserID = $userID";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getUserResponsesIDs() query");
	}

	echo "getUserResponsesIDs() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		array_push($result, $row['QuestionID']);
		echo $row['QuestionID'];
	}
	return $result;
}

function getResponseFromID($conn, $responseID){
	$result = null;
	$tsql = "SELECT UserResponse FROM UserResponsesNew WHERE QuestionID = $responseID";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == False){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getResponseFromID() query");
	}

	echo "getResponseFromID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['UserResponse'];
	}
	return $result;
}

function getQuestionNoFromResponseID($conn, $responseID){
	$result = 0;
	$tsql = "SELECT QuestionNo FROM QNosAndIDs WHERE QuestionID = $responseID";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == False){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in eecuting getQuestionNoFromResponseID() query");
	}
	echo "getResponseFromID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['QuestionNo'];
	}
	return $result;
}

function getQuestionFromQuestionID($conn, $questionNo){
	$result = null;
	$tsql = "SELECT Question FROM AllQuestions WHERE QuestionID = $questionNo";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == False){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in eecuting getQuestionNoFromResponseID() query");
	}
	//echo "getResponseFromID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['Question'];
	}
	return $result;
}

function getBotTimeFromQID($conn, $questionID){
	$result = null;
	$tsql = "SELECT BotMsgTime FROM TimeStamps WHERE QuestionID = $questionID;";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Failure in executing getBotTimeFromQID() query");
	}

	echo "getBotTimeFromQID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['BotMsgTime'];
	}
	return $result;
}

function getUserTimeFromQID($conn, $questionID){
	$result = null;
	$tsql = "SELECT UserMsgTime FROM TimeStamps WHERE QuestionID = $questionID;";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Failure in executing getBotTimeFromQID() query");
	}

	echo "getBotTimeFromQID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['UserMsgTime'];
	}
	return $result;
}

function getTimeLapseFromQID($conn, $questionID){
	$result = null;
	$tsql = "SELECT TimeLapse FROM TimeStamps WHERE QuestionID = $questionID;";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Failure in executing getBotTimeFromQID() query");
	}

	echo "getBotTimeFromQID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['TimeLapse'];
	}
	return $result;
}

function getResponseSentiment($conn, $responseID){
	$result = 0;
	$tsql = "SELECT SentimentScore FROM Sentiment WHERE QuestionID = $responseID;";
	$getResults = sqlsrv_Query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getResponseSentiment() query");
	}

	echo "getResponseSentiment() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['SentimentScore'];
	}
	return $result;
}

function getQuestionType($conn, $questionNo){
	$result = null;
	$tsql = "SELECT QuestionType FROM AllQuestions WHERE QuestionNo = $questionNo";
	$getResults = sqlsrv_Query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getQuestionType() query");
	}

	echo "getQuestionType() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['QuestionType'];
	}
	return $result;
}

function getPhq9Score($conn, $questionID){
	$result = null;
	$tsql = "SELECT Phq9Score FROM Phq9Scores WHERE QuestionID = $questionID";
	$getResults = sqlsrv_Query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing getPhq9Score() query");
	}

	echo "getPhq9Score() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['Phq9Score'];
	}
	return $result;
}

?>