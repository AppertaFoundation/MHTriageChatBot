<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>

	<?php include '../includes/bootstrapHead.php' ?>
	<title>High Scoring Users | MhtBot: Data</title>

</head>
<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>High Scoring Users</h1>
</header>

<main>

<section>

<p>The severity of depression and anxiety corresponding to PHQ-9 and GAD-7 user scores is shown in the tables below.</p>

<div class="table-responsive">
<table class="table" id="depressionSeverity">
	<tr>
		<th>Score Range</th>
		<th>Depression Severity</th>
	</tr>
	<tr>
		<td>0-5</td>
		<td>Mild</td>
	</tr>
	<tr>
		<td>6-10</td>
		<td>Moderate</td>
	</tr>
	<tr>
		<td>11-15</td>
		<td>Moderately severe</td>
	</tr>
	<tr>
		<td>16-20</td>
		<td>Severe depression</td>
	</tr>
</table>
</div>

<div class="table-responsive">
<table class="table" id="anxietySeverity">
	<tr>
		<th>Score Range</th>
		<th>Anxiety Severity</th>
	</tr>
	<tr>
		<td>0-5</td>
		<td>Mild</td>
	</tr>
	<tr>
		<td>6-10</td>
		<td>Moderate</td>
	</tr>
	<tr>
		<td>11-15</td>
		<td>Moderately severe</td>
	</tr>
	<tr>
		<td>15-21</td>
		<td>Severe anxiety</td>
	</tr>
</table>
</div>

</section>

<section>

<?php
$highTotalScore = 15; // scores of 16-20 indicate severe anxiety/depression
$dateFrom = '2017-08-20 00:00:00';
//$dateTo = '2017-08-28 00:00:00';

date_default_timezone_set('Europe/London');

$dateTo = date("Y-m-d H:i:s");

$dateFromToSub = date_create();

date_sub($dateFromToSub, date_interval_create_from_date_string("14 days"));

$dateFrom = date_format($dateFromToSub, "Y-m-d H:i:s");

$severeScores = 0;

$threshold = 1;
?>

<p>Users who have score that is in the PHQ-9/GAD-7 severe range <?php echo $threshold; ?> or more times over a period of two weeks from today (<?php echo $dateTo; ?>) are listed below:</p>


<?php
$userIDs = getAllUserIDs($conn);
foreach($userIDs as $userID){
	$username = getUsernameFromID($conn, $userID);

	// Check phq9 user scores
	$userScoresPhq9 = getUserScoresInDateRange($conn, $userID, $dateFrom, $dateTo, 'phq9');
	foreach($userScoresPhq9 as $userScorePhq9){
		if($userScorePhq9 > 15){
			$severeScores += 1;
		}
	}

	// Check gad7 user scores
	$userScoresGad7 = getUserScoresInDateRange($conn, $userID, $dateFrom, $dateTo, 'gad7');
	foreach($userScoresGad7 as $userScoreGad7){
		if($userScoreGad7 > 14){
			$severeScores +=1;
		}
	}
	
	if($severeScores >= $threshold){
	?>
		<form action = "singleUserDetails.php" method="post">
		<input type="hidden" name="userID" value="<?php echo $userID;?>">
		<button type="submit"><?php echo $username?></button>
		</form>
	<?php
	}
}
?>

</section>

</main>
</body>

<?php include '../includes/scripts.php'; ?>

</html>