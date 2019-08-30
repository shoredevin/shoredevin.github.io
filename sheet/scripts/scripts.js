$(document).ready(function () {
    $("#myInput").on("keyup focus", function () {
        var value = $(this).val().toLowerCase();
        $("#tableBody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

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