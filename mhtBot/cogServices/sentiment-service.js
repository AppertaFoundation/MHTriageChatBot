var fetch = require('node-fetch');

var request = require('request').defaults({encoding: null});

var TEXT_ANALYTICS_URL = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

//var sentimentID = 'bot-analytics';
var sentimentID = 1;

// shttps://www.microsoft.com/reallifecode/2017/06/30/bot-to-human-handover-in-node-js/#sentiment
exports.getSentiment = function(text){
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
					"id": sentimentID,
					"text": text
				}
			]
		}
	};

	//console.log("This is the text into the sentiment service");
	//console.log(text);

	return new Promise(
		function(resolve, reject){
			request(requestData, (error, response, body) => {
				if(error){
					console.log("An error occured in the sentiment promise");
					reject(error);
				}else{
					//https://www.mkyong.com/javascript/how-to-access-json-object-in-javascript/
					console.log("Sentiment score is: " + extractSentimentScore(body));
					resolve(extractSentimentScore(body));
					//console.log(body);
				}
			});
		});
}

function extractSentimentScore(body){
	//console.log("in the extractSentimentScore function");
	//console.log(body);
	return body.documents[0].score;
}

