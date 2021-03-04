function execute() {
    return gapi.client.drive.permissions.getIdForEmail({
      "email": "dshore@edtell.com"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                getPerm(response.result.id)
              },
              function(err) { console.error("Execute error", err.result.error.message); });
  }
function getPerm(id) {
    return gapi.client.drive.permissions.get({
      "fileId": "1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI",
      "permissionId": id
    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
    },
    function(err) { console.error("Execute error", err); });
}