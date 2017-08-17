<?php
//https://docs.microsoft.com/en-us/azure/sql-database/sql-database-connect-query-php
// Connection to Azure Database

$serverName = "mhtbotdb.database.windows.net";
$connectionOptions = array(
	"Database" => "mhtBotDB",
	"Uid" => "mng17@mhtbotdb",
	"PWD" => "1PlaneFifth"
);


// Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);

?>