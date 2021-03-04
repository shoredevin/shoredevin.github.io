// let SCOOPS = [
//     'https://www.googleapis.com/auth/drive',
//     'https://www.googleapis.com/auth/drive.file',
//     'https://www.googleapis.com/auth/drive.readonly',
//     'https://www.googleapis.com/auth/drive.metadata.readonly',
//     'https://www.googleapis.com/auth/drive.appdata',
//     'https://www.googleapis.com/auth/drive.apps.readonly',
//     'https://www.googleapis.com/auth/drive.metadata',
//     'https://www.googleapis.com/auth/drive.photos.readonly'
// ]


// function start() {
//     console.log("started")
//     // 2. Initialize the JavaScript client library.
//     // gapi.auth2.getAuthInstance({
//         var request = gapi.client.drive.permissions.getIdForEmail({
//             'email': 'dshore@gmail.com',
//           });
//           request.execute(function(resp) {
//             console.log('ID: ' + resp.id);
//           });
//         // 'apiKey': 'AIzaSyAiTPu0gDQqDPL0-LKbSu1Jvw4lcCEdFvE',
//         // // clientId and scope are optional if auth is not required.
//         // 'clientId': '1031814387459-03essqpn06v2iqa7qhqlvrgk27t70c2q.apps.googleusercontent.com',
//         // 'scope': SCOOPS,
//     // }).then(function() {
//     // // 3. Initialize and make the API request.
//     //     return gapi.client.request({
//     //     'path': 'https://www.googleapis.com/drive/v2/permissionIds/dshore@edtell.com',
//     // })
//     // }).then(function(response) {
//     //     console.log(response.result);
//     // }, function(reason) {
//     //     console.log('Error: ' + reason.result.error.message);
//     // });
// };
// // 1. Load the JavaScript client library.
// gapi.load('client', start);

/**
 * Print the Permission ID for an email address. 
 *
 * @param {String} email Email address to retrieve ID for.
 */
function printPermissionIdForEmail() {
    var request = gapi.client.drive.permissions.getIdForEmail({
      'email': 'dshore@edtell.com',
    });
    request.execute(function(resp) {
      console.log('ID: ' + resp.id);
    });
  }