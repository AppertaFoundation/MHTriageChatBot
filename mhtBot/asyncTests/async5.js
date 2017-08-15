// Callback hell - callback after callback after callback
window.onload = function(){

	$.ajax({
		type: "GET", 
		url: "data/tweets.json",
		success: function(data){
			console.log(data);

			$.ajax({
				type: "GET", 
				url: "data/friends.json",
				success: function(data){
					console.log(data);

					$.ajax({
						type: "GET", 
						url: "data/videos.json",
						success: function(data){
							console.log(data);
						},
						error: function(jqXHR, textStatus, error){
							console.log(error);
						}
						});
					},
					error: function(jqXHR, textStatus, error){
						console.log(error);
					}
					});

	},
	error: function(jqXHR, textStatus, error){
		console.log(error);
	}
	});
}