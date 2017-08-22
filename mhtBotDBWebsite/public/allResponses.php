<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<title>Database Access for Mental Health Triage Chatbot</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	</head>
<body>
<header>
<h1>All Responses</h1>
</header>

<main>

<h3>Responses to General Questions</h3>

<h4>Question 1 - "How are you feeling"?</h4>

<table>
	<tr>
		<th>Interaction ID</th>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
	</tr>
<?php
	$questionID = 1;
	$questionType = 'generalQs';
	$tsql = "SELECT iq.InteractionID, iq.QuestionID, ur.UserResponse 
				FROM UserResponses ur
				JOIN InteractionQuestionIDs iq
				ON iq.InteractionID = ur.InteractionID
				ORDER BY iq.QuestionID";
	$getResults = sqlsrv_Query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing query to all responses");
	}

	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$interactionID = $row['InteractionID'];
		$questionID = $row['QuestionID'];
		$userResponse = $row['UserResponse'];
		$question = getQuestionFromQuestionID($conn, $questionID);
?>
	<tr>
		<td><?php echo $interactionID; ?></td>
		<td><?php echo $questionID; ?></td>
		<td><?php echo $question; ?></td>
		<td><?php echo $userResponse; ?></td>
	</tr>
	<?php
		}
	?>

</table>