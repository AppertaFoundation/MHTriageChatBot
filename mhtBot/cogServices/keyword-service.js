var fetch = require('node-fetch');

var request = require('request').defaults({encoding: null});

var TEXT_ANALYTICS_URL = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases';

//var sentimentID = 'bot-analytics';
var keywordID= 1;

// shttps://www.microsoft.com/reallifecode/2017/06/30/bot-to-human-handover-in-node-js/#sentiment
exports.getKeywords = function(text){
	var requestData = {
		url: TEXT_ANALYTICS_URL,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': process.env.MICROSOFT_TEXT_API_KEY,
		},
		json: true, 
		body: {
			"documents": [
				{
					"language": "en",
					"id": keywordID,
					"text": text
				}
			]
		}
	};

	return new Promise(
		function(resolve, reject){
			request(requestData, (error, response, body) => {
				if(error){
					console.log("Error in keyword-serviec Promise");
					console.log(error);
					reject(error);
				}else{
					//https://www.mkyong.com/javascript/how-to-access-json-object-in-javascript/
					console.log("Keywords/Phrases are: " + extractKeywords(body));
					resolve(extractKeywords(body));
				}
			});
		});
}

function extractKeywords(body){
	return body.documents[0].keyPhrases;
}

