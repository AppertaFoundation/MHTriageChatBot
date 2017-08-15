// Demonstration of synchronous callback

window.onload = function() {

	function callback(val){
		console.log(val);
	}


	var fruits = ["banana", "apple", "pear"];
	fruits.forEach(callback);
	console.log("done");
};
