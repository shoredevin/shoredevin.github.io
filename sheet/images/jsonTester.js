const fs = require('fs');
// const config = require('./spriteURLs.json');

fs.readFile('./spriteURLs.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    let parsed = JSON.parse(jsonString); 
    console.log(parsed.shiny[9]) 
})