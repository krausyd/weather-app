let searchedCities = [];
const apiKey = "ba9a20571e3980d5b9bb3ea927c72d48";
const oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?appid=" + apiKey + "&units=imperial";
const geocodingAPI = "http://api.openweathermap.org/geo/1.0/direct?appid=" + apiKey;

function searchCity(cityName) {
    searchedCities.push(cityName);
    saveRecentSearches(cityName);
    displayCities();

    fetch(geocodingAPI + "&q="+cityName)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => { 
            if (data && data.length) {
                getForecast(cityName, data[0].lat, data[0].lon)
            }
        });

    //lat={lat}&lon={lon}&exclude={part}&
}

function getForecast(cityName, lat, lon) {
    fetch(oneCallAPI + "&lat=" + lat + "&lon=" + lon)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => { 
            if (data) {
                showTodays(cityName, data.current);
                showFiveDayForecast(data.daily);
            }
        });
}

function showTodays(cityName, current) {
    const div = document.getElementById("city-current");
    div.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.innerText = `${cityName} (${getFormatedDate()})`;
    div.appendChild(h2);

    const ul = document.createElement("ul");

    const liTemp = document.createElement("li");
    liTemp.innerText = `Temp: ${current.temp} °F`;
    ul.appendChild(liTemp);

    const liWind = document.createElement("li");
    liWind.innerText = `Wind: ${current.wind_speed} MPH`;
    ul.appendChild(liWind);

    const liHumidity = document.createElement("li");
    liHumidity.innerText = `Humidity: ${current.humidity}%`;
    ul.appendChild(liHumidity);

    const liUvi = document.createElement("li");
    liUvi.innerText = `UV Index: ${current.uvi}`;
    let uviColor = "purple";
    let uvi = current.uvi;
    if (uvi < 3) {
        uviColor = "green";
    } else if (uvi < 6) {
        uviColor = "yellow";
    } else if (uvi < 8) {
        uviColor = "orange";
    } else if (uvi < 11) {
        uviColor = "red";
    }
    liUvi.setAttribute("class", `uvi-${uviColor}`);
    ul.appendChild(liUvi);

    div.appendChild(ul);
    console.log(current);
}

function getFormatedDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return  mm + '/' + dd + '/' + yyyy;
}

function showFiveDayForecast(daily) {
    console.log(daily);
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