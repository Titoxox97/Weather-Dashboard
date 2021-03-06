// Prevent form from defaulting and recover the data in the search

var button = document.querySelector("#handleCitySearch");

button.addEventListener("click", (event) => {
  event.preventDefault();

  async function startWeather() {
    // Load the API key
    // Determine the object of the input in the search box

    var persApiKey = "67b95bf65d366cdf6a151997dae61b7e";
    var userInput = document.querySelector("#citySearch").value;
    console.log(userInput);

    //api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    https: var coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&appid=${persApiKey}&units=metric`;

    // Pass the url and return the output
    var response = await fetch(coordinatesUrl);
    var data = await response.json();

    var coordinates = data[0];
    const { lat, lon } = coordinates;
    console.log(lat, lon);
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${persApiKey}&units=imperial`;
    var weatherRes = await fetch(weatherUrl);
    var weatherData = await weatherRes.json();
    console.log(weatherData);
    //  Retrieve only the data needed using a list item method
    var symbolLink = `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`;

    // make sure there's no duplicates and when called there will only be one request per city
    // var lsObjects = list.selectAll(".forecastCard");
    // var lsObjArray = Array.from(lsObjects);
    weatherData.daily.forEach((weather) => {
      var weatherDetails = document.createElement("div");

      var markup = `
    <h2 class="currentCity" "${userInput}">  
    <span class="currentCityDate">
    (${moment
      .unix(weather.dt)
      .format("MM/DD/YYYY")})</span> <img id="weatherIcon" src="${symbolLink}"/>
    </h2>
    
      <p class="currentCityTemp">Temperature: ${
        weather.temp.day + " &deg;F"
      }</p>
    
  
      <p class="currentCityHumidity">Humidity: ${weather.humidity + "%"}</p>
    
  
      <p class="currentCityWindSpeed">Wind Speed: ${
        weather.wind_speed + " MPH"
      }</p>
    
  
    
      <p>
      UV Index:
      <span class="${weather.uvi}"
        >${weather.uvi}</span
      >
    </p>
    `;
      weatherDetails.innerHTML = markup;
      document.body.appendChild(weatherDetails);
    });
  }
  startWeather();
});
