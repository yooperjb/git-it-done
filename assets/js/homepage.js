
var getUserRepos = function(user) {
    // format the gihub api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
        });
    });
};
// asynchoronous behaviour - will print before inside
// AJAX Asynchronous javascript and XML
console.log("outside");
getUserRepos("microsoft");