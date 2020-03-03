var download = require('download-file')
 
var urls = [
"https://projectpokemon.org/images/shiny-sprite/eternatus.gif"

]

main();

async function main () {
	let index = 890;
	for (var i = 0; i < urls.length; i++) {
		
		var options = {
			directory: "./images/",
			filename: index + "-s" + ".gif"
		}
		await new Promise(resolve => {
			setTimeout(function() {
				download(urls[i], options, function(err){
					if (err) throw err
					console.log("saved image " + i)
				})
				resolve();
			}, 100);
		index++;
		});
	}	
}