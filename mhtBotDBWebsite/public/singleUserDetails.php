<?php
// Includes
include('includes/connect.php');
include('includes/functions.php');

//$userID = $_POST["userID"];
?>

<?php
// Test Values
$userID = 3;
$username = getUsernameFromID($conn, $userID);
?>


<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Details for Single User</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
<header>
<h1>Details for User<?php echo $username?></h1>
</header>

<main>



<?php
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

function getQuestionFromQuestionNo($conn, $questionNo){
	$result = null;
	$tsql = "SELECT Question FROM AllQuestions WHERE QuestionNo = $questionNo";
	$getResults = sqlsrv_query($conn, $tsql);
	if($getResults == False){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in eecuting getQuestionNoFromResponseID() query");
	}
	echo "getResponseFromID() query successfully executed";
	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$result = $row['Question'];
	}
	return $result;
}



?>

<h2>Conversation History</h2>

<table>
	<tr>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
		<th>Time Bot Sent Question</th>
		<th>Time User Responded to Question</th>
		<th>Time Lapse</th>
	</tr>
	<?php
		//$questionNo = 0;
		$userResponseIDs = getUserResponsesIDs($conn, $userID);
		foreach($userResponseIDs as $responseID){
			//$questionNo = $questionNo + 1;
			echo $responseID;
			$userResponse = getResponseFromID($conn, $responseID);
			$questionNo = getQuestionNoFromResponseID($conn, $responseID);
			$question = getQuestionFromQuestionNo($conn, $questionNo);
			$tsql = "SELECT BotMsgTime, UserMsgTime, TimeLapse FROM TimeStamps WHERE QuestionID = $responseID";
			$getResults = sqlsrv_query($conn, $tsql);
			if($getResults == False){
				if(($errors = sqlsrv_errors())!=null){
					formatErrors($errors);
				}
				die("Error in eecuting getQuestionNoFromResponseID() query");
			}
			echo "getResponseFromID() query successfully executed";
			while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
				$result = $row['Question'];
			}
			return $result;
}
	?>
		<tr>
			<td><?php echo $questionNo ?></td>
			<td><?php echo $question?></td>
			<td><?php echo $userResponse ?></td>

		</tr>
	<?php
		}
	?>

</table>




</main>
</body>

</html>