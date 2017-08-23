<?php

/*
function checkForHarmIdeation($text){
	$riskWord = "suicide";
	if($text.includes($riskWord) == true){
		return true;
	}else{
		return false;
	}
}*/



function checkForHarmIdeation($text){
	$phraseFound = false;
	$suicideIdeationPhrases = array("end it all", "end it all now", "want to be dead", "commit suicide", "thinking about killing", "thinking about kiiling myself", "about killing", "cutting", "depression", "suicide", "wanting to die", "want to die", "wanted to die", "end it", "ending it all", "don't want to live", "don't want to live anymore", "can't cope anymore", "don't want to be alive", "can't take it anymore", "can't go on", "trigger warning", "eating disorder", "death", "selfharm", "self harm", "anxiety", "pain", "hate myself", "kill myself", "want to end it all", "kill");
	for($i = 0; $i<count($suicideIdeationPhrases); $i++){
		if(strpos($text, $suicideIdeationPhrases[$i]) !== false){
			//echo "Yes";
			$phraseFound = true;
			break;
		}else{
			//echo "No";
			$phraseFound = false;
		}
	}
	return $phraseFound;
}


//$str = 'I think I\'m going to kill myself';

$str = 'two days';

$harm = checkForHarmIdeation($str);

echo $harm;


?>