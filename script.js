var APIkey = '5f72767e588cc8f124f76d4337d747d4';
var currentCityWeather = $('#display-city-weather');
var formCitySearch = document.getElementById('search-box')
var currentCityName;
var weather = [];
var cityList = [];

// This function gets City coordinates lon and lat data
function getCityCoordAPI(query) {
    var requestCityUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + query + '&limit=1&lang=en&units=imperial&appid='+ APIkey;
    console.log(requestCityUrl)
    fetch (requestCityUrl)
        .then(function (response) {
            if (!response.ok) {
            $("#search-input")[0].reset()
            alert('ERROR: City not found');
            throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            searchedLat = data.city.coord.lat;
            searchedLon = data.city.coord.lon;
            currentCityName = query;
            console.log(currentCityName+searchedLat+searchedLon);
            getCityWeatherAPI(searchedLat, searchedLon, currentCityName);
        })
};

// Previous API does not fully show all weather info, below function uses one call API for more details using coordinates taken from previous fetch
function getCityWeatherAPI() {
    var requestWeatherUrl = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + searchedLat + '&lon=' + searchedLon + '&lang=en&units=imperial&appid=' + APIkey;
    console.log(requestWeatherUrl)
    fetch (requestWeatherUrl)
        .then(function (response) {
            console.log(response)
            if (!response.ok) {
              throw response.json();
            }
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            weather = [];
            updateCityList(currentCityName);
            for (var i = 0; i < 7; i++) {
                 var currentWeather = {
                     "date":data.daily[i].dt,
                     "temp":data.daily[i].temp.day+` °F`,
                     "humid":data.daily[i].humidity+` %`,
                     "windSPD":data.daily[i].wind_speed+` MPH`,
                     "UV":data.daily[i].uvi,
                     "icon":`https://openweathermap.org/img/wn/`+data.daily[i].weather[0].icon+`.png`
                 }
            currentWeather.date=currentWeather.date * 1000;
            const dateObject = new Date(currentWeather.date);
            currentWeather.date=dateObject.toLocaleDateString();
            weather.push(currentWeather);
            }   
            displayWeather(weather);
          })
}

function displayWeather(weather) {  //updates the info appends to HTML IDs
    $("#day0-WSpd").text(weather[0].wind);
    $("#day0-UVIndex").text(weather[0].UV);
    $(`#currentCityName`).text(currentCityName);
    if (weather[0].UV >= 11) {varUV = `Violet`}; // Extreme-Risk
    if (weather[0].UV < 11) {varUV = `Red`}; // Very High-Risk
    if (weather[0].UV < 8) {varUV = `Orange`}; // High-Risk
    if (weather[0].UV < 6) {varUV = `Yellow`}; // Moderate-Risk
    if (weather[0].UV < 3) {varUV = `Teal`}; // Low-Risk
    $(`#day0-UVIndex`).css( "background-color", varUV);
    for (var i = 0; i <= 5; i++) {
        $(`#day`+i+`-date`).html(weather[i].date);
        $(`#day`+i+`-temp`).text(weather[i].temp);
        $(`#day`+i+`-humid`).text(weather[i].humid);
        $('#day'+i+'-WSpd').html(weather[i].windSPD);
        $(`#day`+i+`-icon`).html(weather[i].icon);
        $(`#day`+i+`-icon`).attr("src",weather[i].icon);
    }
}

function showCityList(cityList) {  //displays the list of cities chosen in the past
    var listText = "";
    for (var i = 0; i < cityList.length; i++) {
      listText += `<li class="btn list-group-item list-group-item-action" onclick="getCityWeatherAPI('`+cityList[i]+`')">`+cityList[i]+`</li>`;
    }
    $(`#cityListGroup`).html(listText);
}

function updateCityList(currentCityName) {  //saves the city list to local storage
    cityList.indexOf(currentCityName) === -1 ? cityList.push(currentCityName) : console.log("City already on list")
    localStorage.setItem("cityList", JSON.stringify(cityList));
    showCityList(cityList);
}

function loadCityList(cityList) {  //function to load the text from memory
    cityList = JSON.parse(localStorage.getItem("cityList"));
    if(!cityList) {  //check to see if the variable exists
        console.log("- No saved information"); // Relay console message
        cityList=[];
        return cityList;
    }
    return cityList;
}

function handleSearchSubmit(event) {
    event.preventDefault();
    var searchInputVal = document.getElementById('search-input').value;
    if (!searchInputVal) {
      console.error('You need a proper search!');
      return searchInputVal
    }
    getCityCoordAPI(searchInputVal);
}

formCitySearch.addEventListener('submit', handleSearchSubmit);
cityList = loadCityList(cityList);
getCityCoordAPI('Dallas', 'Seattle', 'Los Angeles', 'Henderson', 'Las Vegas');
