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



<h2>PHQ9 Totals</h2>

<table>
	<tr>
		<th>Total</th>
		<th>Date Completed</th>
	</tr>
	<?php
		$questionType = 'phq9';
		$tsql = "SELECT Phq9Total, DateCompleted FROM Phq9Totals WHERE UserID = $userID";
		$getResults = sqlsrv_Query($conn, $tsql);
		if($getResults == FALSE){
			if(($errors = sqlsrv_errors())!=null){
				formatErrors($errors);
			}
			die("Error in executing query to get Phq9 totals and completion dates");
		}

		while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
			$phq9Total = $row['Phq9Total'];
			$dateCompleted = $row['DateCompleted'];
	?>
	<tr>
		<td><?php echo $phq9Total; ?></td>
		<td><?php echo date_format($dateCompleted, 'Y-m-d H:i:s'); ?></td>
	</tr>
	<?php
		}
	?>

</table>

<h2>PHQ9 History</h2>

<table>
	<tr>
		<th>Question</th>
		<th>User Response</th>
		<th>Phq9 Score</th>
		<th>Sentiment Score</th>
		<th>Time Bot Messaged</th>
		<th>Time User Replied</th>
		<th>Time Lapse</th>
	</tr>

	<?php
		$questionType = 'phq9';
		$tsql = "SELECT aq.QuestionID, aq.QuestionNo, aq.Question 
					FROM AllQuestions aq 
					JOIN UserQuestionIDs uq ON aq.QuestionID = uq.QuestionID
					WHERE UserID = $userID AND QuestionType ='" . $questionType . "'";
		$getResults = sqlsrv_Query($conn, $tsql);
		if($getResults == FALSE){
			if(($errors = sqlsrv_errors())!=null){
				formatErrors($errors);
			}
			die("Error in executing query to get phq9 questionIDs associated with this user");
		}

		while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
			$responseID = $row['QuestionID'];
			$questionNo = $row['QuestionNo'];
			$question = $row['Question'];

			$userResponse = getResponseFromID($conn, $responseID);
			$botTime = getBotTimeFromQID($conn, $responseID);
			$userTime = getUserTimeFromQID($conn, $responseID);
			$timeLapse = getTimeLapseFromQID($conn, $responseID);
			$phq9Score = getPhq9Score($sonn, $responseID);
			$sentimentScore = getResponseSentiment($conn, $responseID);
			
		?>
			<tr>
				<td><?php echo $question; ?></td>
				<td><?php echo $userResponse; ?></td>
				<td><?php echo $phq9Score; ?></td>
				<td><?php echo $sentimentScore; ?></td>
				<!--http://php.net/manual/en/datetime.format.php-->
				<td><?php echo date_format($botTime, 'Y-m-d H:i:s'); ?></td>
				<td><?php echo date_format($userTime, 'Y-m-d H:i:s'); ?></td>
				<td><?php echo date_format($timeLapse, 'H:i:s'); ?></td>

			</tr>
		<?php
		}
		?>

<h2>GAD7 History</h2>


<h2>General Questions History</h2>

<table>
	<tr>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
		<th>Sentient Score</th>
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
			$sentimentScore = getResponseSentiment($conn, $responseID);

		?>
		<tr>
			<td><?php echo $questionNo; ?></td>
			<td><?php echo $question; ?></td>
			<td><?php echo $userResponse; ?></td>
			<td><?php echo $sentimentScore; ?></td>
			<!--http://php.net/manual/en/datetime.format.php-->
			<td><?php echo date_format($botTime, 'Y-m-d H:i:s'); ?></td>
			<td><?php echo date_format($userTime, 'Y-m-d H:i:s'); ?></td>
			<td><?php echo date_format($timeLapse, 'H:i:s'); ?></td>

		</tr>
	<?php
		}
	?>

</table>


</main>
</body>

</html>