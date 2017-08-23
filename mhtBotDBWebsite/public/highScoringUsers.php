<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>

	<?php include '../includes/bootstrapHead.php' ?>
	<title>High Scoring Users</title>

</head>
<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>High Scoring Users</h1>
</header>

<main>

<p>Below is a list of users who have had particularly high scores over the past two weeks.</p>

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

<p>Users with a score greater than <?php echo $highTotalScore; ?> more than <?php echo $threshold; ?> time over a period of two weeks from today (<?php echo $dateTo; ?>) are listed below</p>


<?php
$userIDs = getAllUserIDs($conn);
foreach($userIDs as $userID){
	$username = getUsernameFromID($conn, $userID);
	$userScores = getUserScoresInDateRange($conn, $userID, $dateFrom, $dateTo);
	foreach($userScores as $userScore){
		if($userScore > $highTotalScore){
			$severeScores += 1;
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

</main>
</body>

<?php include '../includes/bootstrapFoot.php'; ?>

</html>