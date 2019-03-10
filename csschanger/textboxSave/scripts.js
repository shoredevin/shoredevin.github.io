function saveTitle() {
    alert("Save Successful");
    var saveKey = document.getElementById('key').value;
    var saveValue = document.getElementById('value').value;
    localStorage.setItem(saveKey, saveValue);
    //console.log(saveText);
    document.getElementById('key').value = "";
    document.getElementById('value').value = "";
}

function addStyle() {
    //var sheet = document.styleSheets[0];
    //console.log(sheet);
    //console.log(document.styleSheets[0].media.mediaText)
    //var index = sheet.length;
    //console.log("length: " + index);
    //sheet.insertRule("h1", "float: left; background: red !important;", -1);
    var sheet = document.getElementById('devin').sheet
    //document.styleSheets[0].insertRule("#gead{color: white}", -1);

    // var styles = '.new-animation {';
    // styles += 'text-align:right;';
    // styles += 'line-height:150px !important;'
    // styles += '}';

    // console.log(styles);
    var css_rules_num = sheet.cssRules.length;
    console.log(css_rules_num);
    sheet.insertRule("#gead {color:blue;}", css_rules_num);
    //sheet.insertRule("#gead", "color:blue;", css_rules_num);

}