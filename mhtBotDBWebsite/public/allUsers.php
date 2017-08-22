<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>

	<?php include '../includes/bootstrapHead.php' ?>
	<title>All Users | Database Access for Mental Health Triage Chatbot</title>

</head>
<body>

<?php include '../includes/nav.php'; ?>

<main>

<?php 
$userID = getAllUserIDs($conn);
$username = null;
foreach($userID as $userID){
	$username = getUsernameFromID($conn, $userID);
?>

	<form action = "singleUserDetails.php" method="post">
	<input type="hidden" name="userID" value="<?php echo $userID;?>">
	<button type="submit"><?php echo $username?></button>
	</form>
<?php
}
?>

</main>
</body>

<?php include '../includes/bootstrapFoot.php'; ?>

</html>

