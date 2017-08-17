// Asynchronous example
// Asnychronous means something can start now and finish later.
window.onload = function(){

	$.get("data/tweets.json", function(data){
		console.log(data);
	});
	console.log("test");
};