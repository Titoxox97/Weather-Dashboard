//loads data from last search
$(document).ready(function () {
    formHistory();
    let lastSearched = JSON.parse(localStorage.getItem("inputCity"));
    if (lastSearched?.length > 0) {
      //checks to see if search history is in local storage
      
      //if it is then it fetches the data
      let lastCity = lastSearched[lastSearched.length - 1];
      
      //shows the weather data of the last searched city
      makeQuery(lastCity);
    }
    
    $(".handleCitySearch").on("click", function (event) {
      event.preventDefault();
      makeQuery();
      let inputCity = $("#citySearch").val();
  
      // get list of cities from local storage and if the data doesn't exist create an empty array
      let cityArray = JSON.parse(localStorage.getItem("inputCity")) || [];
  
      // add inputCity to li
      cityArray.push(inputCity);
  
      // save the list of cities to local storage again
      localStorage.setItem("inputCity", JSON.stringify(cityArray));
      formHistory();
    });
  
    function makeQuery(city) {
      let inputCity = city ? city : $("#citySearch").val();
  
      //Current Weather Data API + the city searched from the input field
      console.log("City passed from city history clicked: " + city);
      let query1URL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        inputCity +
        "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";
  
      //first AJAX call to the Current Weather API, to obtain the data)
      $.ajax({
        url: query1URL,
        method: "GET",
      })
      
      .then(function (data) {
        console.log("I am current data: ");
        console.log(data);
        let query2URL =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          data.coord.lat +
          "&lon=" +
          data.coord.lon +
          "&units=imperial&appid=ae091cae15863695a3bd2a2f28f74012";
  
        //second AJAX call to one call API in order to obtain the extended forecast and UV index
        $.ajax({
          url: query2URL,
          method: "GET",
        })
        
        .then(function (uvInfo) {
          console.log("I am uv and extended data: ");
          console.log(uvInfo);
  
          //create weatherIcon variable to display the weather icon 
          let weatherIcon = uvInfo.current.weather[0].icon;
          let iconURL =
            "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
  
          //create container to hold the 5-day forecast information
          $(".forBox").html("");
  
          $(".forBox").append(
            '<div id="currentWeather"></div>'
          );
          //append divs to the container to display all the necessary data
          $("#currentWeather").append(
            `<h2 class="currentCity">${
              data.name
              //moment.unix() to format dt unix
            } <span class="currentCityDate">(${moment
              .unix(uvInfo?.current?.dt)
              .format(
                "M/DD/YYYY"
              )})</span> <img id="weatherIcon" src="${iconURL}"/></h2>`
          );
  
          $("#currentWeather").append(
            `<p class="currentCityTemp">Temperature: ${
              uvInfo.current.temp + " &deg;F"
            }</p>`
          );
  
          $("#currentWeather").append(
            `<p class="currentCityHumidity">Humidity: ${
              uvInfo.current.humidity + "%"
            }</p>`
          );
  
          $("#currentWeather").append(
            `<p class="currentCityWindSpeed">Wind Speed: ${
              uvInfo.current.wind_speed + " MPH"
            }</p>`
          );
  
          $("#currentWeather").append(
            `<p>
            UV Index:
            <span class="${uvTitle(uvInfo.current.uvi)}"
              >${uvInfo.current.uvi}</span
            >
          </p>`
          );
          //append divs to the container
          $(".forBox").append('<div id="multiForecastBox"></div>');
          $("#multiForecastBox").append("<h2>5-Day Forecast:</h2>");
          $("#multiForecastBox").append(
            '<div class="forecastCardsContainer"></div>'
          );
          
          uvInfo?.daily?.map((day, index) => {
            if (index > 0 && index < 6) {
              $(".forecastCardsContainer").append(
                `
                  <div class="forecastCard" id="{'card' + index}">
                    <h3>${moment.unix(day.dt).format("M/DD/YYYY")}</h3>
                    <div><img id="weatherIcon" src="https://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }.png"/></div>
                    <p>Temp: ${day.temp.day + " &deg;F"}</p>
                    <p>Humidity: ${day.humidity + "%"}</p>
                  </div>
                `
              );
            }
          });
        });
      });
    }
    //function to return uv classes' for today's date
    function uvTitle(uvi) {
      if (uvi < 4) {
        return "uv-fav";
      } else if (uvi >= 4 && uvi <= 10) {
        return "uv-mod";
      } else if (uvi > 11) {
        return "uv-ext";
      } else {
        return "uv-und";
      }
    }
  
    //function to create searched city buttons
    function formHistory() {
      // get search history from local storage
      let cityData = JSON.parse(localStorage.getItem("inputCity"));
      //if search history doesn't exist, then create a search history container
      if (!$(".searchHistoryContainer")?.length && cityData?.length) {
        $(".searchColumn").append('<div class="searchHistoryContainer"></div>');
      }
  
      //clear the search history
      $(".searchHistoryContainer").html("");
      
      for (
        let cityCounter = 0;
        cityCounter < cityData?.length;
        cityCounter++
      ) {
        let city = cityData[cityCounter];
        $(".searchHistoryContainer").append(
          `<button id="CityBtn${cityCounter}">${city}</button>`
        );
        //on click event function to display the current and 5 Day Forecast and save it to local storage
        $(".searchHistoryContainer").on(
          "click",
          `#CityBtn${cityCounter}`,
          function () {
            makeQuery(city);
            localStorage.setItem("city", JSON.stringify(city));
          }
        );
      }
    }
  });
  