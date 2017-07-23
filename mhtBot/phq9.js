var builder = require('botbuilder');

var none = 'Not at all';
var several = 'Several days';
var more = 'More than half the days';
var often = 'Nearly every day';
var score = 0;

module.exports = [
	/*function(session){
		builder.Prompts.text(session, 'Welcome to the PHQ-9. We are now going to ask you some questions related to how bothered you\'ve been over the past 2 weeks by the problems described. Is this ok?');
	}, */
	function(session){
		builder.Prompts.choice(session, 'How often have you had little interest or pleasure in doing things?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		//session.dialogData.lastResponse = results.response.entity;
		//session.dialogData.lastResponse = results.response;
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your new score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'How often do you feel down, depressed, or hopeless?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your new score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'How often do you have trouble falling or staying asleep, or sleeping too much?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your current score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'Feeling tired or having little energy?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your current score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'Poor appetite or overeating?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your current score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your current score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'Trouble concentrating on things, such as reading the newspaper or watching television?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your current score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results, next){
		score += getScore(results.response.entity);
		session.send('You said \'%s\' and your current score is %i', results.response.entity, score);
		next();
	},
	function(session){
		builder.Prompts.choice(session, 'Thoughts that you would be better off dead or of hurting yourself in some way?', [session.gettext(none), session.gettext(several), session.gettext(more), session.gettext(often)]);
	},
	function(session, results){
		score += getScore(results.response.entity);
		session.send('Thank you for answering these questions. Your final score is %i. This equates to a severity of \'%s\'', score, getPHQ9Severity(score));
		// End
		session.endDialog();
	}
];

// Function to get phq-9 individual question score based on user response
function getScore(response){
	switch(response){
		case 'Not at all':
			return 0;
			break;
		case 'Several days':
			return 1;
			break;
		case 'More than half the days':
			return 2;
			break;
		case 'Nearly every day':
			return 3;
			break;
		default:
			return 20;
	}
}

function getPHQ9Severity(finalScore){
	var s = finalScore;
	if(s>=0 && s<=5){
		return 'mild';
	}else if(s>=6 && s<=10){
		return 'moderate';
	}else if(s>=11 && s<=15){
		return 'moderately severe';
	}else{
		return 'severe depression';
	}
}




