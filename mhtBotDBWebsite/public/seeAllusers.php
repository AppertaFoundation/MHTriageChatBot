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
</html>

