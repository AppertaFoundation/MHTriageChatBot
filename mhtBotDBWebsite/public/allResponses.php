<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<?php include '../includes/bootstrapHead.php' ?>
	<title>All Responses | MhtBot: Data</title>
</head>

<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>All Responses</h1>
</header>

<div class="table-responsive">
<table class="table downloadTable" id="allResponses_<?php echo $username;?>">
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

	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$interactionID = $row['InteractionID'];
		$questionID = $row['QuestionID'];
		$question = getQuestionTextFromQuestionID($conn, $questionID);
		$userResponse = $row['UserResponse']; 
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
</div>

</body>

<?php include '../includes/scripts.php'; ?>

</html>