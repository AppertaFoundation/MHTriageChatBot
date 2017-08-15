<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<title>Database Access for Mental Health Triage Chatbot</title>
	</head>

<header>
<h1>Database Access for Mental Health Triage Chatbot</h1>
</header>

<body>
<p>
This page provides access to the database supporting the mental health triage chatbot.
</p>

<?php
//https://docs.microsoft.com/en-us/azure/sql-database/sql-database-connect-query-php

$serverName = "mhtbotdb.database.windows.net";
$connectionOptions = array(
	"Database" => "mhtBotDB",
	"Uid" => "mng17@mhtbotdb",
	"PWD" => "1PlaneFifth"
);

// Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
$tsql = "SEELCT * FROM UserResponsesNew";
$getResult = sqlsrv_query($conn, $tsql);
echo("Reading data from table" . PHP_EOL);
if($getResults == FALSE) 
	echo (sqlsrv_errors());
while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
	echo($row['UserResponse'] . PHP_EOL);
}
sqlsrv_free_stmt($getResults);



/*

	$username = 'mng17@mhtbotdb';
	$password = '1PlaneFifth';
	$servername = 'mhtbotdb.database.windows.net';
	$database = 'mhtBotDB';
	$port = 1433;

	$conn = mysqli_init();
	$success = mysqli_real_connect(
		$conn,
		$host,
		$user,
		$password,
		$db,
		$port
	);

	if(mysqli_connect_errno()){
		die("Database connection failed: " .
			mysqli_connect_error() .
			" (" . mysqli_connect_errno() . ")"
		);
	}

	$checkDBConnection = "SELECT * FROM UserResponsesNew";

	$connectResult = mysqli_query($conn, $checkDBConnection);

	if(mysqli_num_rows($connectResult) >0){
		while($row = mysqli_fetch_assoc($connectResult)){
			echo $row["Username"];
		}
	}*/

?>


</body>

</html>