$(document).ready(() => {
  'use strict';

  // get data from forecast.io
  const queryForecast = function() {
    const $forecastIO = $.getJSON('https://dailydash.herokuapp.com/40.055550,-105.208595');

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

  queryForecast();

  // get, format, display date and time, trigger hourly update of weather data
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
  (function() {
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
  })();

  // display hourly forecast
  (function() {
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
  })();

  // display daily forecast
  (function() {
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
  })();
});
