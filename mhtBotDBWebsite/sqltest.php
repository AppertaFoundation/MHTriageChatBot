<?php
//https://docs.microsoft.com/en-us/azure/sql-database/sql-database-connect-query-php

$serverName = "tcp:mhtbotdb.database.windows.net, 1433";
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

?>