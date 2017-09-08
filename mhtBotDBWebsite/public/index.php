<?php
// Includes
include '../includes/connect.php';
include '../includes/functions.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<?php include '../includes/bootstrapHead.php' ?>
	<meta name="description" content="Database supporting the mental health triage chatbot.">
	
	<title>Mental Health Triage Chatbot: Data</title>

	<!-- Latest compiled and minified CSS -->
	<!-- ref: http://getbootstrap.com/docs/3.3/getting-started/#download -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

</head>

<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>Mental Health Triage Chatbot: Data</h1>
</header>

<main>

<p>Access the Mental Health Triage Chatbot's data on this site.<p>

<p>If you would like to speak to the MhtBot, it is available on the following channels:</p>

<ul>
	<li><a href="http://mhttestbot.azurewebsites.net/">Web Chat and Skype</a></li>
	<li><a href = "https://www.facebook.com/MhtBot-878645355626146">Facebook Messenger</a>*</li>
	<li>SMS at +441163262158</li>
</ul>

<p>* Please note that MhtBot in Facebook Messenger is currently only available to designated testers.</p>


</main>
</body>

<?php include '../includes/scripts.php'; ?>

</html>