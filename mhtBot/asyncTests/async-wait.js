function isUsername(){
	return new Promise(function(resolve, reject){
		console.log("Step 1");
		var userExists = false;
		resolve(userExists);
	}
	);
}

isUsername().then(function(response){
	console.log("Step 2");
	if(response==true){
		login();
	}else{
		register();
	}
});



function login(){
	console.log("Step 3");
	console.log("Login begins");
}

function register(){
	console.log("Step 3");
	console.log("registeration begins");
}
/*
var request = require('request');
// a function returning a promise
function getRandomPonyFooArticle(){
	return new Promise((resolve, reject) => {
		request('https://ponyfoo.com/articles/random', (err, res, body) => {
			if(err) {
				reject(error); 
				console.log("error in getRandomPonyFooArticle promise");
				return;
			}
			console.log("getRandomPonyFooArticle promise resolved");
			resolve(body);
		});
	});
}

//getRandomPonyFooArticle();

read();

async function read() {
	var html = await getRandomPonyFooArticle();
	var md = hget(html, {
		markdown: true,
		root: 'main', 
		ignore: '.at-subscribe, .mm-comments, .de-sidebar'
	});
	var txt = marked(md, {
		renderer: new Term()
	});
	return txt;
}


function getJSON(){
	console.log("This is the getJSON function");
}

function makeRequest(){
	return new Promise(function(resolve, reject){
		var req = "Hello";
		if(req == "Hello"){
			resolve("This was successful");
		}else{
			reject("This was not susccessufl");
		}
	});
}

makeRequest().then(function(response){
	console.log("Now in second functino", response);
}, function(error){
	console.error("Did not work", erro);
})

/*const makeRequest = () =>
	getJSON()
		.then(data => {
			console.log(data);
			return "done"
})*/

//makeRequest()

/*const makeRequest2 = async () => {
	console.log(await getJSON())
	return "done"
}*/

//makeRequest2()

//https://ponyfoo.com/articles/understanding-javascript-async-await



