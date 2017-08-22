<?php
// Includes
include 'includes/connect.php';
include 'includes/functions.php';

?>

<?php
//Test values
//$userID = 3;
//$username = 'Sam';
?>

<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<title>Database Access for Mental Health Triage Chatbot</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	</head>
<header>
<h1>Database Access for Mental Health Triage Chatbot</h1>
<h2>This page provides access to the database supporting the mental health triage chatbot.</h2>
</header>

<body>
<nav>
<a href="public/seeAllUsers.php">All Users</a>
<a href = "public/seeSingleUserDetails">Single User Details</a>
</nav>

<h3>All Data</h3>

<table>
	<tr>
		<th>Interaction ID</th>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
	</tr>
<?php
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

	echo "Successfully queried database";

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

</body>

</html>