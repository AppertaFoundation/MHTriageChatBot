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

</head>

<body>

<?php include '../includes/nav.php'; ?>

<header>
<h1>About</h1>
</header>

<main>

<h2>The Mental Health Triage Chatbot (MhtBot)</h2>

<p>The Mental Health Triage Chatbot (MhtBot) was developed with the intention of assisting healthcare providers with mental health triage.</p>

<h2>Data</h2>

<p>The MhtBot stores user information including message history and PHQ-9 and GAD-7 scores. This data is currently publically available on this site. However, the intention in future development is to restrict access to data to relevant healthcare providers, while still giving user's access to their own data.
</p>

<h2>Chatting to the MhtBot</h2>
<p>If you would like to speak to the MhtBot, it is available on the following channels:</p>

<ul>
	<li><a href="http://mhttestbot.azurewebsites.net/">Web Chat and Skype</a></li>
	<li><a href = "https://www.facebook.com/MhtBot-878645355626146">Facebook Messenger</a>*</li>
	<li>SMS at +441158245488</li>
</ul>

<p>* Please note that MhtBot in Facebook Messenger is currently only available to designated testers.</p>


</main>
</body>

<?php include '../includes/scripts.php'; ?>

</html>