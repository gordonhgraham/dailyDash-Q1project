$(document).ready(() => {
  'use strict';

  // get weather data from forecast.io
  const queryForecast = function(lat, lon) {
    const $forecastIO = $.getJSON(`https://dailydash.herokuapp.com/${lat},${lon}`);

    $forecastIO.done((data) => {
      if ($forecastIO.status !== 200) {
        return;
      }
      const rawData = JSON.stringify(data);

      localStorage.setItem('forecastResponse', rawData);
    });
    $forecastIO.fail((err) => {
      return err;
    });
  };

  // get latitude and longitude from google geocode API
  const zip = 61821;

  const getLatLon = function(zip) {
    const $geocode = $.getJSON(`https://maps.googleapis.com/maps/api
/geocode/json?address=${zip}&key=AIzaSyDRn-LQTI5bRG2k5CLE5elw8jgnthn20wk`);

    $geocode.done((data) => {
      if ($geocode.status !== 200) {
        return;
      }
      const lat = data.results[0].geometry.location.lat;
      const lon = data.results[0].geometry.location.lng;
      const city = data.results[0].address_components[1].long_name;
      const state = data.results[0].address_components[3].short_name;

      $('#location').text(`${city} | ${state}`);

      queryForecast(lat, lon);

      return;
    });

    $geocode.fail((err) => {
      return err;
    });
  };
  getLatLon(zip);

  // get, format, display date and time
  (function() {
    const formatDay = function(i) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'
      ];

      return days[i];
    };

    // turn off if user selects 24 hour time display
    const formatHour = function(hr) {
      return (hr > 12) ? hr - 12 : hr;
    };

    const formatMonth = function(j) {
      const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July',
        'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
      ];

      return months[j];
    };

    const formatTime = function(i) {
      return (i < 10) ? `0${i}` : i;
    };

    const getDate = function() {
      const today = new Date();
      const day = formatDay(today.getDay());
      const date = today.getDate();
      const month = formatMonth(today.getMonth());
      const year = today.getFullYear();

      $('#date').text(`${day} | ${month} ${date}, ${year}`);
    };

    const getTime = function() {
      const today = new Date();
      const hr = formatHour(today.getHours());
      const min = formatTime(today.getMinutes());

      $('#time').text(`${hr}:${min}`);
      setTimeout(() => {
        getTime();
        getDate();
      }, 500);
    };

    getDate();
    getTime();
  })();

  // display current conditions
  const displayCurrentConditions = function() {
    const forecastResponse =
      JSON.parse(localStorage.getItem('forecastResponse'));

    const currentTemp =
      Math.round(forecastResponse.currently.apparentTemperature);

    const skycons = new Skycons({
      color: '#f8f8f8'
    });
    const currentIcon = forecastResponse.currently.icon;
    const currentSummary = forecastResponse.currently.summary;

    skycons.add('icon_current', currentIcon);
    $('#current > h1').text(`${currentTemp}\u00B0`);
    $('#current > p').text(currentSummary);
    skycons.play();
  };

  // display hourly forecast
  const displayHourlyForecast = function() {
    const forecastResponse =
      JSON.parse(localStorage.getItem('forecastResponse'));

    const hourlyForecast = [];

    // retreive forecast for each hour and store in array
    for (let i = 1; i < 5; i++) {
      const hourlyTemp =
        Math.round(forecastResponse.hourly.data[i].apparentTemperature);

      const hourlyIcon =
        forecastResponse.hourly.data[i].icon;

      const hourlyPrecipProb =
        (forecastResponse.hourly.data[i].precipProbability) * 100;

      const hourlyForecastObj = {
        icon: hourlyIcon,
        precipProb: hourlyPrecipProb,
        temp: hourlyTemp
      };

      hourlyForecast.push(hourlyForecastObj);
    }

    for (let i = 0; i < hourlyForecast.length; i++) {
      $(`#t${i + 1}hr`)
        .text(`time + ${i + 1} hr Temperature ${hourlyForecast[i].temp}
        Chance of precipitation ${hourlyForecast[i].precipProb}%`);
    }

    // const skycons = new Skycons({ color: '#f8f8f8' });
    // skycons.add('icon_t+1hr', hourlyIcon);
    // skycons.play();
  };

  // display daily forecast
  const displayDailyForecast = function() {
    const forecastResponse =
      JSON.parse(localStorage.getItem('forecastResponse'));

    const dailyForecast = [];

    // retreive forecast for each day and store in array
    for (let i = 1; i < 5; i++) {
      const dailyHighTemp =
        Math.round(forecastResponse.daily.data[i].apparentTemperatureMax);

      const dailyLowTemp =
        Math.round(forecastResponse.daily.data[i].apparentTemperatureMin);

      const dailyIcon =
        forecastResponse.daily.data[i].icon;

      const dailyForecastObj = {
        highTemp: dailyHighTemp,
        icon: dailyIcon,
        lowTemp: dailyLowTemp
      };

      dailyForecast.push(dailyForecastObj);
    }

    for (let i = 0; i < dailyForecast.length; i++) {
      $(`#t${i + 1}d`)
        .text(`time + ${i + 1}d HighTemp ${dailyForecast[i].highTemp}
        LowTemp ${dailyForecast[i].lowTemp}`);
    }
  };

  displayCurrentConditions();
  displayHourlyForecast();
  displayDailyForecast();

  const refreshWeatherData = function() {
    queryForecast();
    displayCurrentConditions();
    displayHourlyForecast();
    displayDailyForecast();
    setTimeout(refreshWeatherData, 6e5);
  };

  // refreshWeatherData();
});
