//search logic
$(document).ready(function () {
    $('#myInput').on('keyup focus', function () {
        var value = this.value.toLowerCase();
        var filter = [];
        console.log(filter);
        while (value.length > 0) {
            if (value.indexOf('||') == -1) {
                if (value.trim().length > 0) {
                    filter.push(value.trim());
                };
                break;
            } else {
                index = value.indexOf('||');
                filter.push(value.slice(0, index).trim())
                value = value.slice(index+2, value.length);
            };
        };
        var table = document.getElementById('tableBody');
        var tr = table.getElementsByTagName('tr');
        for (var i = 0; i < tr.length; i++) {
            // console.log(tr[i].innerText);
            if (filter.length == 0) {
                tr[i].style.display = '';
            } else {
                for (var k = 0; k < filter.length; k++) {
                    if (filter[k].indexOf('&') > -1) {
                        let string = filter[k];
                        console.log("string: " + string)
                        let countAmp =  string.match(/&/g).length;
                        for (var m = 0; m <= countAmp + 1; m++) {
							if (m == countAmp + 1) {
								if (tr[i].textContent.toLowerCase().indexOf(string.slice(0, string.length)) > -1) {
                                    tr[i].style.display = '';
                                    break;
								} else {
                                    tr[i].style.display = 'none';
								}
							} else if (tr[i].textContent.toLowerCase().indexOf(string.slice(0, string.indexOf('&'))) > -1) {
								string = string.slice(string.indexOf('&') + 1, string.length);
                            } else {
                                tr[i].style.display = 'none';      
                            }
                        }
                    } else if (tr[i].textContent.toLowerCase().indexOf(filter[k]) > -1) {
                        tr[i].style.display = '';
                        break;
                    } else {
                        tr[i].style.display = 'none';
                    };
                };
            };
        };
        // for (var i = 0; i < tr.length; i++) {
        //     // console.log(tr[i].innerText);
        //     if( filter.length == 0) {
        //         tr[i].style.display = '';
        //     } else {
        //         for(var k = 0; k < filter.length; k++) {
        //             if (filter[k].indexOf('&') > -1) {
        //                 if (tr[i].textContent.toLowerCase().indexOf(filter[k].slice(0, filter[k].indexOf('&'))) > -1 && tr[i].textContent.toLowerCase().indexOf(filter[k].slice(filter[k].indexOf('&')+1, filter[k].length)) > -1) {
        //                     tr[i].style.display = '';
        //                     break;
        //                 } else {
        //                     tr[i].style.display = 'none';
        //                 }
        //             } else if (tr[i].textContent.toLowerCase().indexOf(filter[k]) > -1) {
        //                 tr[i].style.display = '';
        //                 break;
        //             } else {
        //                 tr[i].style.display = 'none';    
        //             };
        //         };
        //     };
        // };
    });
});

// $(document).ready(function () {
//     $("#myInput").on("keyup", function () {
//         var regex1 = /[&]/gi;
//         var regex2 = /[|]/gi;
//         let value = this.value.toLowerCase();
//         console.log('value: ' + value);
//         if (value.indexOf('||') > -1) {
//             console.log('here')
//             document.getElementById('myInput').value.replace(regex1, '');
//         } else if (value.indexOf('&') > -1) {
//             console.log('no here')
//             document.getElementById('myInput').value.replace(regex2, '');
//     }
//     });
// });

// $(document).ready(function () {
//     $("#myInput").on("focus", function () {
//         var value = $(this).val().toLowerCase();
//         $("#tableBody tr").filter(function () {
//             $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
//         });
//     });
// });

function addToSearch(char) {
    var currChar = document.getElementById('myInput').value;
    if (char == '★' && currChar == '★') {
        document.getElementById('myInput').value = '☆';
    } else if (char == '♥' && currChar == '♥') {
        document.getElementById('myInput').value = '♡';
    } else {
        document.getElementById('myInput').value = char;
    }
    document.getElementById('myInput').focus();
}

function clearSearch() {
    document.getElementById('myInput').value = '';
    document.getElementById('myInput').focus();
    document.activeElement.blur()
    $('#table-container').scrollTop(0);
}

async function getCurrTimeUTC() {
    let url = 'https://worldtimeapi.org/api/timezone/America/new_york';
    let response = await fetch(url);
    let data = await response.json();
    let str = data.utc_datetime;
    let time = str.slice(str.indexOf('T') + 1, str.indexOf('.'));
    let date = str.slice(0, str.indexOf('T'))
    // let timezone = data.abbreviation;
    let timeStamp = time + ' ' + date + ' ' + 'UTC';
    // console.log(timeStamp);
    return timeStamp;
}

window.onload = function() {
    //switch hidden ability (class name) with variable from option selection
    document.getElementById('press-me').addEventListener("click", function() {
        let classToChange = document.getElementById('col-selector').value;
        let element = document.querySelector('.' + classToChange);
        console.log(element.length);
        let styles = getComputedStyle(element);
        let disp = styles.display;
        if (disp == 'none') {
            let cols = document.getElementsByClassName(classToChange);
            for (let i = 0; i < cols.length; i++) {
                cols[i].style.cssText = 'display: table-cell';
            }
            console.log('show', classToChange)
            
        } else {
            let cols = document.getElementsByClassName(classToChange);
            for (let i = 0; i < cols.length; i++) {
                cols[i].style.cssText = 'display: none';

            }
            console.log("hide", classToChange)
            // document.getElementById('col-selector').selectedIndex=0;
        }
        document.getElementById('col-selector').selectedIndex=0;
        document.getElementById('press-me').disabled = true;
    });
// }

// window.onload = function() {
    document.getElementById('col-selector').addEventListener("click", function() {
        currSelection = document.getElementById('col-selector').value;
        // console.log(currSelection);
        if(currSelection != '---') {
            document.getElementById('press-me').disabled = false;
        } else {
            document.getElementById('press-me').disabled = true;
        }
    });
}