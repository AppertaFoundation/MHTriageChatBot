<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>

	<?php include '../includes/bootstrapHead.php' ?>
	<title>All Users | MhtBot: Data</title>

</head>
<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>All Users</h1>
</header>

<main>

<p>This is a list of all users on the system. More details about each individual user are accessible by clicking on their name.</p>

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

