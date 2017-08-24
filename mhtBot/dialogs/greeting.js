//------------------//
// greeting Dialog
//------------------//

var builder = require('botbuilder');

module.exports = [
	function(session, args, next){
		builder.Prompts.confirm(session, "Are you already registered?");
	},
	function(session, results){
		session.sendTyping();
		var userResponse = results.response;
		if(userResponse == true){
			session.endDialog('Great, let\'s log you in');
			session.beginDialog('login');
		}else{
			session.send('No problem. Registering is quick and easy');
			session.userData.usernameValid = true;
			session.beginDialog('register');
		}
	}
];