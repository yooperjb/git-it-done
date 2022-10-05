var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

// get Repo name from Query String
var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    // console.log("repoName", repoName);
    
    // Check if the Repo Name exists in query string
    if (repoName) {
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        document.location.replace("./index.html");
    }
};

// fetch Repo Issues
var getRepoIssues = function(repo) {
    
    // API endpoint for repo issues
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl)
        .then(function(response) {
            // if request successful
            if (response.ok) {
                response.json().then(function(data){
                    // pass response data to DOM function
                    displayIssues(data);

                    // Check for Link header
                    response.headers.get("Link") && displayWarning(repo);
                });
            }
            else {
                // if not successful, redirect to homepage
                document.location.replace("./index.html");
            }
        });
};

// Display Repo Issues in DOM
var displayIssues = function(issues) {
    
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    for (var i=0; i < issues.length; i++) {
        // create a link element to take users to the issue on Github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        // console.log(issueEl);

        // create span to hold issue Title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append titleEl to issueEl
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append typeEl to issueEl
        issueEl.appendChild(typeEl);

        // console.log("Issue",issueEl);
        issueContainerEl.appendChild(issueEl);
    }
    
};

// Display warning if more than 30 issues
var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https/github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append linkEl to limitWarningEl
    limitWarningEl.appendChild(linkEl);
};

getRepoName();