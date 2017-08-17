<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';

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
<h1>Details for User <?php echo $username?></h1>
</header>

<main>

<?php echo $userID; ?>

<h2>Conversation History</h2>

<?php
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
?>

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
			$botTime = getBotTimeFromQID($conn, $responseID);
			$userTime = getUserTimeFromQID($conn, $responseID);
			$timeLapse = getTimeLapseFromQID($conn, $responseID);

		?>
		<tr>
			<td><?php echo $questionNo; ?></td>
			<td><?php echo $question; ?></td>
			<td><?php echo $userResponse; ?></td>
			<td><?php echo $botTime; ?></td>
			<td><?php echo $userTime; ?></td>
			<td><?php echo $timeLapse; ?></td>

		</tr>
	<?php
		}
	?>

</table>

</main>
</body>

</html>