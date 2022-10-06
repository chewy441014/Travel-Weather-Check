// declare global variables
var weatherData;
var curWeather;
var weatherInd = [3, 11, 19, 27, 35];

function onLoad() {
    console.log('javascript running');
    getForecast(29.760427, -95.369804);
    getCurWeather(29.760427, -95.369804);
}

function getForecast(lat, lon) {
    console.log('getting data from open weather map and saving to an object');
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    // my api key e055eaf747d060c6746853339afd2bb7
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon + '&appid=e055eaf747d060c6746853339afd2bb7';
    $.ajax({
        url: requestUrl, 
        method: 'GET',
    }).then( function (response) {
        console.log('AJAX Response \n-------------');
        console.log(response);
        weatherData = response;
        showForecast();
    })
}

function showForecast() {
    console.log('showing weather data on the right');
    // weatherData.list[weatherInd[i]].dt_txt // = '2022-10-10 12:00:00'
    // url = 'http://openweathermap.org/img/wn/'+ weatherData.list[weatherInd[i]].weather[0].icon + '@2x.png // icon
    // weatherData.list[weatherInd[i]].main.temp - 273.15 // temp in C
    // weatherData.list[weatherInd[i]].main.humidity // humidity as an integer < 100
    // weatherData.list[weatherInd[i]].wind.speed // wind speed
    for (let i = 1; i < 6; i ++) { //update the five cards below the first
        var myCard = $(`#card${i}`).find("li");
        var url = 'http://openweathermap.org/img/wn/'+ weatherData.list[weatherInd[i-1]].weather[0].icon + '@2x.png' // icon
        myCard[0].textContent = weatherData.list[weatherInd[i-1]].dt_txt;
        myCard[1].innerHTML = '<img src="' + url + '" alt="' + weatherData.list[weatherInd[i-1]].weather[0].description + '" >';
        myCard[2].textContent = "Temp: " + (Math.round((weatherData.list[weatherInd[i-1]].main.temp - 273.15)*100)/100) + " C";
        myCard[3].textContent = "Wind: " + weatherData.list[weatherInd[i-1]].wind.speed + " m/s";
        myCard[4].textContent = "Humidity: " + weatherData.list[weatherInd[i-1]].main.humidity + "%";
    }
}

function getCurWeather (lat, lon) {
    console.log("getting current weather");
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lon + '&appid=e055eaf747d060c6746853339afd2bb7';
    $.ajax({
        url: requestUrl, 
        method: 'GET',
    }).then( function (response) {
        console.log('AJAX Response \n-------------');
        console.log(response);
        curWeather = response;
        showCurWeather();
    })

}

function showCurWeather () {
    console.log("showing current weather");
    var myCard = $("#card0");
    var myTitle = myCard.find("h5");
    myTitle.textContent = curWeather.name;
    var myList = myCard.find("li");
    var url = 'http://openweathermap.org/img/wn/'+ curWeather.weather[0].icon + '@2x.png' // icon
    myList[0].textContent = Date().slice(0,15);
    myList[1].innerHTML = '<img src="' + url + '" alt="' + curWeather.weather[0].description + '" >';
    myList[2].textContent = "Temp: " + (Math.round((curWeather.main.temp - 273.15)*100)/100) + " C";
    myList[3].textContent = "Wind: " + curWeather.wind.speed + " m/s";
    myList[4].textContent = "Humidity: " +curWeather.main.humidity + "%";
}

onLoad();
