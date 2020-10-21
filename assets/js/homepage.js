var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// Fetch github user repos
var getUserRepos = function(user) {
    // format the gihub api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url - send data/user to displayRepos
    fetch(apiUrl)
        .then(function(response){
            // if request was successful
            if (response.ok) {
                response.json().then(function(data) {
                displayRepos(data, user);
            }); 
            }
            else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            // Notice this '.catch()' getting chained onto the end of the '.then()
            alert("Unable to connect to GitHub");
        });
};
// asynchoronous behaviour - will print before inside
// AJAX Asynchronous javascript and XML
console.log("outside");

// get and display user repo information
var displayRepos = function(repos, searchTerm) {
    // clear old content in repoContainer
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over user repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        console.log(repos[i].name);

        // create a link for each repo, set class, and href
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo="+repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issues(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append statusEl to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);

    }
};

// Username form submission - pass user to getUserRepos
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get username value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    }
    else {
        alert("Please enter a GitHub username");
    }
};


userFormEl.addEventListener("submit", formSubmitHandler);
