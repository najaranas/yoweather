const mainContent = document.querySelector(".main-content");
const searchInput = document.querySelector(".search input");
const suggestionElement = document.querySelector(".suggestion");
const searchElement = document.querySelector(".search");
const locationBtn = document.querySelector(".location");
const daysOfWeeksArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let controller = new AbortController();
let timeoutId; // Variable to hold the timeout ID
let PlacedataArray = [];
let boxId = 1;

window.addEventListener("load", () => {
    setTimeout(() => {
        // remove overlay
        document.querySelector(".loadOverLay").style.display = "none";
        document.querySelector(".main-content").style.display = "block";

        // Load Tunis, Tunisia weather data by default
        loadTunisWeatherData();

        // Add event listeners
        searchInput.addEventListener("input", handleInputEvents);
        searchInput.addEventListener("focus", handleInputEvents);

        // searchinput blur event
        document.body.addEventListener("click", (event) => {
            if (!searchElement.contains(event.target) && !suggestionElement.contains(event.target)) {
                document.querySelector(".search").classList.remove("clicked");
                document.querySelector(".search").classList.remove("focused");
                suggestionElement.style.display = "none";
            }
        });

        // arrow-back-icon click event
        document.querySelector(".arrow-back-icon").addEventListener("click", () => {
            document.querySelector(".search").classList.remove("clicked");
            document.querySelector(".search").classList.remove("focused");
            suggestionElement.style.display = "none";
            searchInput.classList.remove("open");
            document.querySelector("header .search .arrow-back-icon ").style.display = "none";
        });
        document.querySelector(".search-icon ").addEventListener("click", () => {
            document.querySelector(".search ").classList.add("clicked");
            setTimeout(() => {
                searchInput.classList.add("open");
                document.querySelector("header .search .arrow-back-icon ").style.display = "block";
            }, 400);
        });
        // location click event
        locationBtn.addEventListener("click", (event) => {
            showLocationPermission();
            getCurrentLocationData();
            searchInput.value = "";
        });
    }, 2000);
});

let locationPermissionDenialCount = 0;
function showLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                locationBtn.classList.add("clicked");
            },
            (error) => {
                locationPermissionDenialCount++;
                localStorage.setItem("counter", locationPermissionDenialCount);
                locationBtn.classList.remove("clicked");
                if (localStorage.getItem("counter") && +localStorage.getItem("counter") > 2) {
                    localStorage.setItem("counter", "2");
                }
                console.log(error.message);
                if (localStorage.getItem("counter") == 2) {
                    alert("Please enable location access in your browser settings.");
                    return;
                }
            }
        );
    }
}

// Function to handle input events
function handleInputEvents() {
    controller.abort();
    controller = new AbortController();

    // Clear any existing timeout
    clearTimeout(timeoutId);
    document.querySelector("header .reload-circle").classList.add("started");
    if (searchInput.value !== "") {
        timeoutId = setTimeout(() => {
            getSuggestions(searchInput.value, controller);
        }, 1000);
    } else {
        clearSuggestion();
    }
}

// Function to clear suggestion box
function clearSuggestion() {
    suggestionElement.innerHTML = "";
    document.querySelector(".search").classList.remove("focused");
    document.querySelector("header .reload-circle").classList.remove("started");
    suggestionElement.style.display = "none";
}

// Function to handle fetch suggestions
async function getSuggestions(place, controller) {
    const apiKey = "82707ef5433a8e6d8069809dad1d25e0";
    const api = `https://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${apiKey}`;
    try {
        const response = await fetch(api, { signal: controller.signal });
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        PlacedataArray = [];
        suggestionElement.innerHTML = "";
        boxId = 1;
        const json = await response.json();
        if (json.length === 0) {
            suggestionElement.innerHTML = "No Results Found";
            document.querySelector(".search").classList.add("focused");
            suggestionElement.style.display = "block";
            document.querySelector("header .reload-circle").classList.remove("started");
            return;
        }
        for (const data of json) {
            const state = data.state || data.name;
            createSuggestionBox(data.name, state, data.country, boxId);
            document.querySelector(".search").classList.add("focused");
            suggestionElement.style.display = "block";
            document.querySelector("header .reload-circle").classList.remove("started");
            PlacedataArray.push({
                lat: data.lat,
                lon: data.lon,
                name: data.name,
                coutry: data.country,
                state: data.state,
            });
            boxId++;
        }
        // get lat and lon data
        const boxElements = document.querySelectorAll(".suggestion .box");
        boxElements.forEach((box) => {
            box.addEventListener("click", (event) => {
                // close suggestionElement
                document.querySelector(".search").classList.remove("focused");
                suggestionElement.style.display = "none";
                document.querySelector(".search").classList.remove("clicked");
                document.querySelector(".search").classList.remove("focused");
                suggestionElement.style.display = "none";
                searchInput.classList.remove("open");
                document.querySelector("header .search .arrow-back-icon ").style.display = "none";
                // get lat and lon data
                const dataId = box.getAttribute("data-id");
                const lat = PlacedataArray[+dataId - 1].lat;
                const lon = PlacedataArray[+dataId - 1].lon;
                const coutry = PlacedataArray[+dataId - 1].coutry;
                const state = PlacedataArray[+dataId - 1].state;
                const name = PlacedataArray[+dataId - 1].name;

                // add overlay
                document.querySelector(".loadOverLay").style.display = "flex";
                document.querySelector(".main-content").style.display = "none";

                // get weather data
                currentWeather(lat, lon, coutry, name, state);

                // get 5 days forecast data
                fiveDaysForecast(lat, lon);

                // get airpollution data
                airPollution(lat, lon);

                // enable current location
                locationBtn.classList.remove("clicked");
            });
        });
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Fetch error:", error.message);
        }
    }
}

// Function to create suggestion box
function createSuggestionBox(name, state, country, id) {
    const text = `
    <span class="material-symbols-outlined">location_on</span>
    <div class="data">
        <div class="name">${name}</div>
        <div class="adresse">${state} ${country}</div>
    </div>
    `;
    const boxElement = document.createElement("div");
    boxElement.classList.add("box");
    boxElement.setAttribute("data-id", id);
    boxElement.innerHTML = text;
    suggestionElement.appendChild(boxElement);
}

// get currentWeather APIfunction start
async function currentWeather(lat, lon, coutry, name, state) {
    const apiKey = "82707ef5433a8e6d8069809dad1d25e0";
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=${apiKey}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const json = await response.json();

        // update main weather box
        replaceWeatherData(json, coutry, name, state);
    } catch (error) {
        console.error("Fetch error :", error);
    }
}

// get fiveDaysForecast API function start
async function fiveDaysForecast(lat, lon) {
    const apiKey = "82707ef5433a8e6d8069809dad1d25e0";
    const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const json = await response.json();
        replaceFiveDaysForecastData(json);
        replaceTodaysTimesData(json);
    } catch (error) {
        console.error("Fetch error :", error);
    }
}

// replace FiveDaysForecast data function
function replaceFiveDaysForecastData(json) {
    let counter = 0;
    const boxs = document.querySelectorAll(".days-forecast .box");
    boxs.forEach((box) => {
        const date = new Date(json.list[counter].dt * 1000);

        // update icon
        const iconElement = box.querySelector(".days-forecast .box .weather-icon ");
        updateWeatherIcon(json.list[counter].weather[0].icon, iconElement);

        // update day value
        const day = box.querySelector(".days-forecast .box .day");
        day.innerHTML = daysOfWeeksArray[date.getDay()];

        // update month value
        const month = box.querySelector(".days-forecast .box .month");
        month.innerHTML = date.getUTCDate() + " " + monthsArray[date.getUTCMonth()];

        // update temp value
        const temp = box.querySelector(".days-forecast .box .temp-data");
        temp.innerHTML = Math.round(json.list[counter].main.temp) + "°";
        counter += 7;
    });
}

// replaceTodaysTimesData
function replaceTodaysTimesData(json) {
    let counter = 0;
    const weatherTempBoxs = document.querySelectorAll(".right .today-times .weather-temp .box");
    const windSpeedBoxs = document.querySelectorAll(".right .today-times .wind-speed .box");
    weatherTempBoxs.forEach((Box) => {
        Box.setAttribute("title", json.list[counter].weather[0].description);
        date = new Date(json.list[counter].dt * 1000).toLocaleTimeString([], {
            hour: "numeric",
        });
        Box.querySelector(".time").innerHTML = date;
        Box.querySelector(".temp").innerHTML = json.list[counter].main.temp.toFixed("0") + "°";
        updateWeatherIcon(json.list[counter].weather[0].icon, Box.querySelector(".weather-icon"));
        counter++;
    });
    counter = 0;
    windSpeedBoxs.forEach((Box) => {
        date = new Date(json.list[counter].dt * 1000).toLocaleTimeString([], {
            hour: "numeric",
        });
        Box.querySelector(".time").innerHTML = date;
        Box.querySelector(".speed").innerHTML = json.list[counter].wind.speed.toFixed("0") + " km/h";
        Box.querySelector(".weather-icon").style.cssText = `
        transform: rotate(${json.list[counter].wind.deg}deg);`;

        counter++;
    });
}

// get airPollution APIfunction start
async function airPollution(lat, lon) {
    const apiKey = "82707ef5433a8e6d8069809dad1d25e0";
    const api = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const json = await response.json();
        replaceAirPollutionData(json);
    } catch (error) {
        console.error("fetch error :", error);
    }
}
//

function replaceAirPollutionData(json) {
    // getAirQualityStatus
    document.querySelector(".right .content  .air-quality .little-box .air-quality-status ").innerHTML =
        getAirQualityStatus(json.list[0].components.so2);

    // pm25
    document.querySelector(".right .content  .air-quality .box-content .data-box .pm25 .value ").innerHTML =
        json.list[0].components.pm2_5;

    // so2
    document.querySelector(".right .content  .air-quality .box-content .data-box .SO2  .value ").innerHTML =
        json.list[0].components.so2;

    // no2
    document.querySelector(".right .content  .air-quality .box-content .data-box .NO2  .value ").innerHTML =
        json.list[0].components.no2;

    // o3
    document.querySelector(".right .content  .air-quality .box-content .data-box .O3   .value ").innerHTML =
        json.list[0].components.o3;

    // remove overlay
    document.querySelector(".loadOverLay").style.display = "none";
    document.querySelector(".main-content").style.display = "block";
}

// get getAirQualityStatus
function getAirQualityStatus(SO2) {
    if (SO2 >= 350) {
        return "Very Poor";
    } else if (SO2 >= 250) {
        return "Poor";
    } else if (SO2 >= 80) {
        return "Moderate";
    } else if (SO2 >= 20) {
        return "Fair";
    } else {
        return "Good";
    }
}

// replace weather data function
function replaceWeatherData(json, coutry, name, state) {
    // update time
    let dateNow = new Date();
    document.querySelector(".today-temp .time .local-time").innerHTML = dateNow.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    setInterval(() => {
        dateNow = new Date();
        document.querySelector(".today-temp .time .local-time").innerHTML = dateNow.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, 1000 * 60);

    // update temp data in °C
    document.querySelector(".today-temp .temp-data .temp .data").innerHTML = Math.round(json.main.temp) + " °C";

    // update temp icon
    const iconElement = document.querySelector(".today-temp .temp-data .temp .weather-icon");
    updateWeatherIcon(json.weather[0].icon, iconElement);

    // update sky status
    document.querySelector(".today-temp .temp-data .sky-status").innerHTML = json.weather[0].description;

    // update day

    document.querySelector(".today-temp .date-location .date .text").innerHTML = `${
        daysOfWeeksArray[dateNow.getDay()]
    } ${dateNow.getDate()}, ${monthsArray[dateNow.getMonth()]}`;

    // update location
    state = state || name;

    document.querySelector(".today-temp .date-location .location .text").innerHTML = state + "," + coutry;

    // sunrise
    const sunriseTime = new Date(json.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    document.querySelector(".right .content  .sunrise-sunset .box-content .sunrise  .value ").innerHTML = sunriseTime;

    //sunset
    const sunsetTime = new Date(json.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    document.querySelector(".right .content  .sunrise-sunset .box-content .sunset  .value ").innerHTML = sunsetTime;

    //humadity
    document.querySelector(".right .content  .humadity .box-content .value ").innerHTML = json.main.humidity + "%";

    //pressure
    document.querySelector(".right .content  .pressure .box-content .value ").innerHTML = json.main.pressure + "hPa";

    //pressure
    document.querySelector(".right .content  .visibility .box-content .value ").innerHTML =
        json.visibility / 1000 + "km";

    //pressure
    document.querySelector(".right .content  .feelslike .box-content .value ").innerHTML =
        json.main.feels_like.toFixed("0") + "°C";
}

// update weather icon function
function updateWeatherIcon(icon, element) {
    if (icon === "01d" || icon === "01n") {
        element.innerHTML = "sunny";
    } else if (icon === "02d") {
        element.innerHTML = "partly_cloudy_day";
    } else if (icon === "02n") {
        element.innerHTML = "partly_cloudy_night";
    } else if (icon === "03d" || icon === "03n") {
        element.innerHTML = "cloud";
    } else if (icon === "04d" || icon === "04n") {
        element.innerHTML = "cloud";
    } else if (icon === "09d" || icon === "09n") {
        element.innerHTML = "rainy";
    } else if (icon === "10d" || icon === "10n") {
        element.innerHTML = "rainy";
    } else if (icon === "11d" || icon === "11n") {
        element.innerHTML = "thunderstorm";
    } else if (icon === "13d" || icon === "13n") {
        element.innerHTML = "ac_unit";
    } else if (icon === "50d" || icon === "50n") {
        element.innerHTML = "mist";
    } else {
        // Default value if image name doesn't match any condition
        element.innerHTML = "unknown";
    }
}

// get user ip adresse

async function geocodingReverse(lat, lon) {
    const apiKey = "82707ef5433a8e6d8069809dad1d25e0";
    const api = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error("response was not Ok!");
        }
        const json = await response.json();
        return { name: json[0].name, country: json[0].country, state: json[0].state };
    } catch (error) {
        console.error("Error fetching user IP address:", error);
    }
}

// get user local  data
function getCurrentLocationData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                // add loadOverLay
                document.querySelector(".loadOverLay").style.display = "flex";
                document.querySelector(".main-content").style.display = "none";
                // add loadOverLay

                const Results = await geocodingReverse(position.coords.latitude, position.coords.longitude);
                var country = Results.country;
                var region = Results.state;
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                currentWeather(latitude, longitude, country, region);
                fiveDaysForecast(latitude, longitude);
                airPollution(latitude, longitude);
            } catch (error) {
                console.error(error);
            }
        });
    }
}

// Load Tunis, Tunisia weather data by default
async function loadTunisWeatherData() {
    try {
        // Tunis, Tunisia coordinates
        const lat = 36.8065;
        const lon = 10.1815;
        const country = "TN";
        const name = "Tunis";
        const state = "Tunis";

        // add overlay
        document.querySelector(".loadOverLay").style.display = "flex";
        document.querySelector(".main-content").style.display = "none";

        // get weather data
        currentWeather(lat, lon, country, name, state);

        // get 5 days forecast data
        fiveDaysForecast(lat, lon);

        // get airpollution data
        airPollution(lat, lon);

        // enable current location
        locationBtn.classList.remove("clicked");
    } catch (error) {
        console.error("Error loading Tunis weather data:", error);
    }
}
