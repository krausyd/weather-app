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
    const mainDiv = document.getElementById("forecast");
    mainDiv.innerHTML = "";

    const div = document.createElement("section");
    div.setAttribute("id", "city-current");
    div.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.innerText = `${cityName} (${getFormatedDate(new Date())})`;
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
    liUvi.innerHTML = 'UV Index: <span class="uvi-condition uvi-' +  uviColor + '">' + current.uvi + '</span>';
    ul.appendChild(liUvi);

    div.appendChild(ul);

    mainDiv.appendChild(div);
}

function getFormatedDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    return  mm + '/' + dd + '/' + yyyy;
}

function showFiveDayForecast(daily) {
    const mainDiv = document.getElementById("forecast");

    const div = document.createElement("section");
    div.setAttribute("id", "city-forecast");
    div.setAttribute("class", "row");
    div.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.innerText = "5-Day Forecast:";
    div.appendChild(h2);

    const divEmpty = document.createElement("div");
    divEmpty.setAttribute("class", "col-1");
    div.appendChild(divEmpty);

    for(let i=1; i<daily.length && i<6; i++) {
        const dayData = daily[i];
        const divOneDay = document.createElement("div");
        divOneDay.setAttribute("class", "col-2 day-weather");
        
        const h3 = document.createElement("h3");
        h3.innerText = getFormatedDate(new Date(dayData.dt*1000));
        divOneDay.appendChild(h3);

        const ul = document.createElement("ul");

        const liConditions = document.createElement("li");
        const imgConditions = document.createElement("img");
        imgConditions.setAttribute("src", `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`);
        liConditions.appendChild(imgConditions);
        ul.appendChild(liConditions);

        const liMinTemp = document.createElement("li");
        liMinTemp.innerText = `Min Temp: ${dayData.temp.min} °F`;
        ul.appendChild(liMinTemp);

        const liMaxTemp = document.createElement("li");
        liMaxTemp.innerText = `Max Temp: ${dayData.temp.max} °F`;
        ul.appendChild(liMaxTemp);
    
        const liWind = document.createElement("li");
        liWind.innerText = `Wind: ${dayData.wind_speed} MPH`;
        ul.appendChild(liWind);
    
        const liHumidity = document.createElement("li");
        liHumidity.innerText = `Humidity: ${dayData.humidity}%`;
        ul.appendChild(liHumidity);

        divOneDay.appendChild(ul);

        div.appendChild(divOneDay);
    }

    mainDiv.appendChild(div);
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