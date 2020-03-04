const download = require('download-file')
const fs = require('fs');
 

main();

async function main () {
    let data;
    new Promise (function(resolve) {
        fs.readFile('./spriteURLs.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err)
                return
            }
            data = JSON.parse(jsonString);
            resolve();
        })
    }).then( async function()  {
        let index = 001;
        for (let i = 0; i < data.shiny.length; i++) {
		
            let options = {
                directory: "./test/",
                filename: index + ".gif"
            }
            let url = data.shiny[i];
            await new Promise(resolve => {
                setTimeout(function() {
                    download(url, options, function(err){
                        if (err) {
                            console.log(err + " _ " + options.filename)
                            resolve();
                        } else {
                            // console.log(options.filename + " saved")
                            resolve();
                        }
                    })
                }, 100);
            index++;
            });
        }
    });	
}