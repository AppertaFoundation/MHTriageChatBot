var builder = require('botbuilder');

module.exports = [
	function(session){
		session.send('Welcome to the PHQ-9. We are now going to ask you some questions related to how bothered you\'ve been over the past 2 weeks by the problems described');
		builder.Prompts.text(session, 'Feeling nervous, anxious, or on edge?');
	}, 
	function(session){
		builder.Prompts.text(session, 'Not being able to stop or control worrying?');
	},
	function(session){
		builder.Prompts.text(session, 'Worrying too much about different things?');
	},
	function(session){
		builder.Prompts.text(session, 'Trouble relaxing?');
	},
	function(session){
		builder.Prompts.text(session, 'Being so restless that it is hard to sit still?');
	},
	function(session){
		builder.Prompts.text(session, 'Becoming easily annoyed or irritable?');
	},
	function(session){
		builder.Prompts.text(session, 'Feeling afraid as if something awful might happen?');
	},
	function(session){
		session.send('Thank you.');
		// End
		session.endDialog();
	}
];