var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

// Fetch github user repos
var getUserRepos = function(user) {
    
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
       .then(function(response){
            // if request was succcessfull
            if (response.ok){
            response.json()
            .then(function(data){
            displayRepos(data, user);
            //console.log(data);
            });
            }   else {
            alert ("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            // Catch getting chained onto end of .then()
            alert("Unable to connect to Github");
        });
};

// Username form submission - pass user to getUserRepos
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from form input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

// get and display user repo information
var displayRepos = function(repos, searchTerm) {
        
    // check if API returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old repo content 
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format user/repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // create a span element to hold repository name

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create an element for repo status
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has open issues
        if (repos[i].open_issues_count > 0 ) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issues(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // status element to div
        repoEl.appendChild(statusEl);
        
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// fetch featured repos of given language and write to page
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                //    console.log(data);
                    displayRepos(data.items, language);
                })
            } else {
                alert("Error: " + response.statusText);
            }
    })
};

// filter repos based on search topic button
var buttonClickHandler = function(event) {
    language = event.target.getAttribute("data-language");
    console.log(language);
    if (language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);