<?php
// Includes
include('includes/connect.php');
include('includes/functions.php');

?>

<?php
//Test values
$userID = 3;
$username = 'Sam';
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
</header>

<body>
<p>
This page provides access to the database supporting the mental health triage chatbot.
</p>

<nav>
<a href="public/seeAllUsers.php">All Users</a>
<a href = "public/seeSingleUserDetails">Single User Details</a>
</nav>

<h2>What would you like to do?</h2>

<form action = "public/seeAllUsers.php" method="post">
<button type="submit" value="allUsers">See All Users</button>
</form>

<form action = "public/seeHighScoringUsers.php" method="post">
<button type = "submit" value="highScoringUsers">See High Scoring Users</button>
</form>

<h2> Testing getUsernameFromID()</h2>
<?php
echo getUsernameFromID($conn, 3);

?>

<h2> Testing getUserResponses()</h2>

<?php
$userResponsesArr = getUserResponses($conn, 3);
foreach($userResponsesArr as $value){
	echo "$value <br>";
}
print_r($userResponsesArr);
?>


<h2> Testing php getAllUsernames() function</h2>
<?php

$usernameArr= getAllUsernames($conn);

foreach($usernameArr as $value){
	echo "$value <br>";
}
?>


<h2>Testing php getUserID() function</h2>

<?php
echo "UserID of $username is " . getUserID($conn, $username);
?>

<h2> Page </h2>

<button type="button">Change Content</button>

<!--
<script>
$('button').on('click', function(e){
	e.preventDefault();
	$.ajax({
		url: 'query.php',
		type: 'GET',
		success: function(data){
			console.log(data);
		}
	});
});

</script>
-->

</body>

</html>