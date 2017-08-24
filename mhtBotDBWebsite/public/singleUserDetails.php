<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';

$userID = $_POST["userID"];
?>

<?php
// Test Values
//$userID = 7;

$username = getUsernameFromID($conn, $userID);
?>


<!DOCTYPE html>
<html lang="en">
<head>
	<?php include '../includes/bootstrapHead.php' ?>
	<title><?php echo $username;?> Details</title>
</head>
<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>Details for User <?php echo $username?></h1>
</header>

<main>

<h2>Questionnaire Totals</h2>

<div class="table-responsive">s
<table class="table">
	<tr>
		<th>ID</th>
		<th>Questionnaire Type</th>
		<th>Total Score</th>
		<th>Date Completed</th>
	</tr>

<?php
$questionnaireIDs = getUserQuestionnaires($conn, $userID);
foreach($questionnaireIDs as $questionnaireID){
	$ID = $questionnaireID . $username;
	$questionnaireType = getQuestionnaireType($conn, $questionnaireID);
	$totalScore = getQuestionnaireTotalScore($conn, $questionnaireID);
	$dateCompleted = getQuestionnaireDateCompleted($conn, $questionnaireID);
?>

	<tr>
		<td><?php echo $ID; ?></td>
		<td><?php echo $questionnaireType; ?></td>
		<td>
			<?php
				if($totalScore != null){
					echo $totalScore;
				}else{
					echo "User has not completed this questionnaire";
				}
			?>
		</td>
		<td>
			<?php
				if($dateCompleted != null){
					echo date_format($dateCompleted, 'Y-m-d H:i:s');
				}else{
					echo "n/a";
				}
			?>
		</td>
	</tr>

<?php
}
?>

</table>
</div>

<h2>PHQ-9 History</h2>

<div class="table-responsive">
<table class="table">
	<tr>
		<th>QuestionnaireID</th>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
		<th>PHQ-9 Score</th>
		<th>Sentiment Score</th>
		<th>Time Bot Messaged</th>
		<th>Time User Replied</th>
		<th>Time Lapse</th>
	</tr>
<?php 
$questionnaireIDs = getUserPHQ9s($conn, $userID);
foreach($questionnaireIDs as $questionnaireID){
	//$questionnaireID = $username+$questionnaireID;
	$interactionIDs = getQuestionnaireInteractionIDs($conn, $questionnaireID);
	foreach($interactionIDs as $interactionID){
		$questionID = getQuestionIDFromInteractionID($conn, $interactionID);
		$questionText = getQuestionTextFromQuestionID($conn, $questionID);
		$userResponse = getUserResponseFromInteractionID($conn, $interactionID);
		$phq9Score = getQuestionScore($conn, $interactionID);
		$sentimentScore = getSentimentScore($conn, $interactionID);
		$botTime = getBotTime($conn, $interactionID);
		$userTime = getUserTime($conn, $interactionID);
		$timeLapse = getTimeLapse($conn, $interactionID);
?>
	<tr>
		<td><?php echo $questionnaireID+$username; ?></td>
		<td><?php echo $questionID; ?></td>
		<td><?php echo $questionText; ?></td>
		<td><?php echo $userResponse; ?></td>
		<td><?php echo $phq9Score; ?></td>
		<td><?php echo $sentimentScore; ?></td>
		<td><?php echo date_format($botTime, 'Y-m-d H:i:s'); ?></td>
		<td><?php echo date_format($userTime, 'Y-m-d H:i:s'); ?></td>
		<td><?php echo date_format($timeLapse, 'H:i:s'); ?></td>
	</tr>
<?php
	}
}
?>

</table>
</div>

<h2>GAD7 History</h2>

<div class="table-responsive">
<table class="table">
	<tr>
		<th>Questionnaire ID</th>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
		<th>GAD-7 Score</th>
		<th>Sentiment Score</th>
		<th>Time Bot Messaged</th>
		<th>Time User Replied</th>
		<th>Time Lapse</th>
	</tr>
<?php 
$questionnaireIDs = getUserGAD7s($conn, $userID);
foreach($questionnaireIDs as $questionnaireID){
	//$questionnaireID = $username+$questionnaireID;
	$interactionIDs = getQuestionnaireInteractionIDs($conn, $questionnaireID);
	foreach($interactionIDs as $interactionID){
		$questionID = getQuestionIDFromInteractionID($conn, $interactionID);
		$questionText = getQuestionTextFromQuestionID($conn, $questionID);
		$userResponse = getUserResponseFromInteractionID($conn, $interactionID);
		$gad7Score = getQuestionScore($conn, $interactionID);
		$sentimentScore = getSentimentScore($conn, $interactionID);
		$botTime = getBotTime($conn, $interactionID);
		$userTime = getUserTime($conn, $interactionID);
		$timeLapse = getTimeLapse($conn, $interactionID);
?>
	<tr>
		<td><?php echo $questionnaireID+$username; ?></td>
		<td><?php echo $questionID; ?></td>
		<td><?php echo $questionText; ?></td>
		<td><?php echo $userResponse; ?></td>
		<td><?php echo $gad7Score; ?></td>
		<td><?php echo $sentimentScore; ?></td>
		<td><?php echo date_format($botTime, 'Y-m-d H:i:s'); ?></td>
		<td><?php echo date_format($userTime, 'Y-m-d H:i:s'); ?></td>
		<td><?php echo date_format($timeLapse, 'H:i:s'); ?></td>
	</tr>
<?php
	}
}
?>

</table>
</div>

<h2>General Questions History</h2>

<div class="table-responsive">
<table class="table">
	<tr>
		<th>Questionnaire ID</th>
		<th>Question Text</th>
		<th>User Response</th>
		<th>Sentiment Score</th>
		<th>Time Bot Messaged</th>
		<th>Time User Replied</th>
		<th>Time Lapse</th>
	</tr>
<?php 
$questionnaireIDs = getUserGeneralQs($conn, $userID);
foreach($questionnaireIDs as $questionnaireID){
	//$questionnaireID = $username+$questionnaireID;
	$interactionIDs = getQuestionnaireInteractionIDs($conn, $questionnaireID);
	foreach($interactionIDs as $interactionID){
		echo $interactionID;
		$questionID = getQuestionIDFromInteractionID($conn, $interactionID);
		$questionText = getQuestionTextFromQuestionID($conn, $questionID);
		$userResponse = getUserResponseFromInteractionID($conn, $interactionID);
		$gad7Score = getQuestionScore($conn, $interactionID);
		$sentimentScore = getSentimentScore($conn, $interactionID);
		$botTime = getBotTime($conn, $interactionID);
		$userTime = getUserTime($conn, $interactionID);
		$timeLapse = getTimeLapse($conn, $interactionID);
?>
	<tr>
		<td><?php echo $questionnaireID+$username; ?></td>
		<td><?php echo $questionID; ?></td>
		<td><?php echo $questionText; ?></td>
		<td><?php echo $userResponse; ?></td>
		<td><?php echo $sentimentScore; ?></td>
		<td><?php echo date_format($botTime, 'Y-m-d H:i:s'); ?></td>
		<td><?php echo date_format($userTime, 'Y-m-d H:i:s'); ?></td>
		<td><?php echo date_format($timeLapse, 'H:i:s'); ?></td>
	</tr>
<?php
	}
}
?>

</table>
</div>


</main>
</body>

<?php include '../includes/bootstrapFoot.php'; ?>

</html>