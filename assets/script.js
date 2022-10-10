// declare global variables
var weatherData;
var curWeather;
var searchButton = $('#searchButton');
var searchInput = $('#searchInput');
var historyEl = $('#historyTag');
var coords;
var historyArr = [];

function onLoad() {
    // console.log('javascript running');
    getAllWeather(29.760427, -95.369804);
    // set search button event listener
    searchButton.on("click", searchHandler);
    searchInput.keypress(searchEnter);
    loadLocalStorage();
    loadHistory();
}

function getAllWeather (lat, lon) {
    getForecast(lat, lon);
    getCurWeather(lat, lon);
}

function getForecast(lat, lon) {
    // console.log('getting forecast from open weather map and saving to an object');
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    // my api key e055eaf747d060c6746853339afd2bb7
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon + '&appid=e055eaf747d060c6746853339afd2bb7';
    $.ajax({
        url: requestUrl, 
        method: 'GET',
    }).then( function (response) {
        // console.log('AJAX Response \n-------------');
        //console.log(response);
        weatherData = response;
        showForecast();
    })
}

function showForecast() {
    // console.log('showing weather data on the bottom');
    // weatherData.list[weatherInd[i]].dt_txt // = '2022-10-10 12:00:00'
    // url = 'https://openweathermap.org/img/wn/'+ weatherData.list[weatherInd[i]].weather[0].icon + '@2x.png // icon
    // weatherData.list[weatherInd[i]].main.temp - 273.15 // temp in C
    // weatherData.list[weatherInd[i]].main.humidity // humidity as an integer < 100
    // weatherData.list[weatherInd[i]].wind.speed // wind speed
    // find the five weather data list entries for 3PM Thanks IAN
    var smallWeatherData = weatherData.list.filter((element) => element.dt_txt.includes("15:00:00"));
    console.log(smallWeatherData);
    for (let i = 0; i < 5; i ++) { //update the five cards below the first
        var myCard = $(`#card${i+1}`).find("li");
        var url = 'https://openweathermap.org/img/wn/'+ smallWeatherData[i].weather[0].icon + '@2x.png' // icon
        myCard[0].textContent = smallWeatherData[i].dt_txt.slice(0,10);
        myCard[1].innerHTML = '<img src="' + url + '" alt="' + smallWeatherData[i].weather[0].description + '" >';
        myCard[2].textContent = "Temp: " + (Math.round((smallWeatherData[i].main.temp - 273.15)*100)/100) + " C";
        myCard[3].textContent = "Wind: " + smallWeatherData[i].wind.speed + " m/s";
        myCard[4].textContent = "Humidity: " + smallWeatherData[i].main.humidity + "%";
    }
}

function getCurWeather (lat, lon) {
    // console.log("getting current weather");
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lon + '&appid=e055eaf747d060c6746853339afd2bb7';
    $.ajax({
        url: requestUrl, 
        method: 'GET',
    }).then( function (response) {
        // console.log('AJAX Response \n-------------');
        curWeather = response;
        showCurWeather();
    })

}

function showCurWeather () {
    // console.log("showing current weather");
    var myCard = $("#card0");
    var myTitle = myCard.find("h5");
    myTitle[0].textContent = curWeather.name;
    var myList = myCard.find("li");
    var url = 'https://openweathermap.org/img/wn/'+ curWeather.weather[0].icon + '@2x.png' // icon
    myList[0].textContent = Date().slice(0,15);
    myList[1].innerHTML = '<img src="' + url + '" alt="' + curWeather.weather[0].description + '" >';
    myList[2].textContent = "Temp: " + (Math.round((curWeather.main.temp - 273.15)*100)/100) + " C";
    myList[3].textContent = "Wind: " + curWeather.wind.speed + " m/s";
    myList[4].textContent = "Humidity: " +curWeather.main.humidity + "%";
}

function getLatLonCity (cityName) {
    //https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=e055eaf747d060c6746853339afd2bb7';
    $.ajax({
        url: requestUrl, 
        method: 'GET',
    }).then( function (response) {
        console.log('AJAX Response \n-------------');
        // console.log(response);
        if (response.length > 0) {
            coords = [response[0].lat, response[0].lon];
            getAllWeather(coords[0], coords[1]);
        }
    })
}

function searchHandler () {
    if (/^[A-Za-z ]*$/.test(searchInput.val()) && searchInput.val()) {
        // console.log('searching for ' + searchInput.val());
        getLatLonCity(searchInput.val());
        newHistory(searchInput.val());
        historyArr.push(searchInput.val());
        saveLocalStorage();
        searchInput.val('');
    } else {
        searchInput.val('');
    }
}

function searchEnter (event) {
    if (event.keyCode === 13) {
        searchHandler();
    }
}

function loadLocalStorage () {
    if (JSON.parse(localStorage.getItem("historyArr"))) {
        // if there is already a history object in local storage then set the historyArr equal to it's value
        historyArr = JSON.parse(localStorage.getItem("historyArr"));
    } else {
        // if there's not already a history object in local storage then make an empty one
        localStorage.setItem("historyArr", null);
    }
}

function saveLocalStorage () {
    localStorage.setItem("historyArr", JSON.stringify(historyArr));
}

function newHistory (cityName) {
    // <li class="list-group-item">Austin</li>
    var newEntry = $("<li>");
    newEntry.addClass("list-group-item");
    newEntry.text(cityName);
    newEntry.on("click",switchFocus);
    historyEl.append(newEntry);
}

function loadHistory () {
    if (JSON.parse(localStorage.getItem("historyArr"))) {
        // if there is already a history object in local storage then set the historyArr equal to it's value
        var locHistoryArr = JSON.parse(localStorage.getItem("historyArr"));
        for (let i = 0; i < locHistoryArr.length; i++) {
            newHistory(locHistoryArr[i]); // display all the past searches on load. 
        }
    } else {
        // if there's not already a history object in local storage
        console.log("Whoops");
    }
}

function switchFocus (event) {
    event.preventDefault();
    var cityName = $(event.target).text();
    getLatLonCity(cityName);
}

onLoad();
