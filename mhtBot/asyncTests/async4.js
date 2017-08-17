// Asynchronous example
// Asnychronous means something can start now and finish later.
window.onload = function(){

	function cb(data){
		console.log(data);
	}

	$.get("data/tweets.json", cb);
	console.log("test");
};