const download = require('download-file')
const fs = require('fs');
 

let ids = [
    "0376",
    "0380",
    "0381",
    "0384",
    "0428",
    "0475",
    "0531",
    "0719"
]

main();

async function main () {
    let data;
    new Promise (function(resolve) {
        fs.readFile('./spriteURLs2.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err)
                return
            }
            data = JSON.parse(jsonString);
            resolve();
        })
    }).then( async function()  {
        let index = 001;
        for (let i = 0; i < data.normal.length; i++) {
		
            let options = {
                directory: "./test/",
                filename: ids[i] + ".gif"
            }
            let url = data.normal[i];
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