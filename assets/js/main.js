let searchedCities = [];

function searchCity(cityName) {
    searchedCities.push(cityName);
    saveRecentSearches(cityName);
    displayCities();
}

function getRecentSearches() {
    const savedSearches = localStorage.getItem("cities");
    if (savedSearches) {
        searchedCities = JSON.parse(savedSearches);
    }

    displayCities();
}

function saveRecentSearches() {
    localStorage.setItem("cities", JSON.stringify(searchedCities));
}

function displayCities() {
    const ul = document.getElementById("recent-searches");
    ul.innerHTML = "";
    for(let i=searchedCities.length-1; i>=0; i--) {
        const li = document.createElement("li")
        li.setAttribute("class", "historic-city");
        li.innerHTML = searchedCities[i];
        li.addEventListener("click", function() {
            searchCity(searchedCities[i]);
        });
        ul.appendChild(li);
    }
}

document.getElementById("search-button").addEventListener("click", function() {
    let cityInput = document.getElementById("city-search");
    if (cityInput.value && cityInput.value.trim()) {
        searchCity(cityInput.value.trim());
    }
});
getRecentSearches();