var builder = require('botbuilder');

var DialogLabels = {
	Intro: 'Intro',
	Anxiety: 'gad7',
	Depression: 'phq9'
};

module.exports = [
	function(session){
		session.send('Hello!');
		builder.Prompts.text(session, 'What has led you to seek an assessment for depression/anxiety?');
	}, 
	function(session){
		builder.Prompts.text(session, 'What has triggered any negative thoughts and feelings?');
	},
	function(session){
		builder.Prompts.text(session, 'What have these thoughts and feelings stopped you doing?');
	},
	function(session){
		builder.Prompts.text(session, 'Do you have a care plan and, if so, is it working for you?');
	},
	function(session){
		builder.Prompts.choice(session, 'Are you struggling more with anxiety or with depression?', [DialogLabels.Anxiety, DialogLabels.Depression],
		{
			maxRetries: 3,
			retryPrompt: 'Not a valid option'
		});
	},
	function (session, result){
		if(!result.response){
			session.send('Too many attempts. Ending this dialog');
			return session.endDialog();
		}

		var selection = result.response.entity;
		switch(selection){
			case DialogLabels.Anxiety:
				return session.beginDialog('gad7');
			case DialogLabels.Depression:
				return session.beginDialog('phq9');
		}
	}
];