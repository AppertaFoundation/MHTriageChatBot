<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';

?>

<?php
//Test values
//$userID = 3;
//$username = 'Sam';
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="Database supporting the mental health triage chatbot, MaxBot">
	
	<title>Database Access for Mental Health Triage Chatbot</title>

	<!-- Latest compiled and minified CSS -->
	<!-- ref: http://getbootstrap.com/docs/3.3/getting-started/#download -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

</head>

<body>

<!--Navigation/header-->
<!--ref: <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top"> -->
<nav class="navbar navbar-inverse navbar-expand-md fixed-top">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#siteNavBar" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">MaxBot Database Access</a>
		</div>
		
	        <span class="navbar-toggler-icon"></span>
	    </button>

		<div class="collapse navbar-collapse" id="siteNavBar">
			<ul class="nav navbar-nav">
				<li class="active"><a href="#">Home<span class="sr-only"> (current)</span></a></li>
				<li><a href="#">About</a></li>
				<li><a href="public/singleUserDetails.php">Users</a></li>
			</ul>
		</div><!-- /.navbar-collapse -->
	</div><!-- /.container-fluid -->
</nav>


<h3>All Data</h3>

<div class="table-responsive">
<table class="table">
	<tr>
		<th>Interaction ID</th>
		<th>Question Number</th>
		<th>Question Text</th>
		<th>User Response</th>
	</tr>

<?php
	$tsql = "SELECT iq.InteractionID, iq.QuestionID, ur.UserResponse 
				FROM UserResponses ur
				JOIN InteractionQuestionIDs iq
				ON iq.InteractionID = ur.InteractionID
				ORDER BY iq.QuestionID";
	$getResults = sqlsrv_Query($conn, $tsql);
	if($getResults == FALSE){
		if(($errors = sqlsrv_errors())!=null){
			formatErrors($errors);
		}
		die("Error in executing query to all responses");
	}

	echo "Successfully queried database";

	while($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)){
		$interactionID = $row['InteractionID'];
		$questionID = $row['QuestionID'];
		$userResponse = $row['UserResponse'];
		$question = getQuestionFromQuestionID($conn, $questionID);
?>
	<tr>
		<td><?php echo $interactionID; ?></td>
		<td><?php echo $questionID; ?></td>
		<td><?php echo $question; ?></td>
		<td><?php echo $userResponse; ?></td>
	</tr>
	<?php
		}
	?>


</table>
</div>

</body>

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>

<script type="text/javascript">window.jQuery || document.write("<script type='text/javascript' src='js/jquery-1.8.3.min.js'>\x3C/script>")</script>

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

</html>