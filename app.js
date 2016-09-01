$(document).ready(() => {
  'use strict';

  // set defaults
  // if (!localStorage) {
    // localStorage.setItem('imgCategory', 'nature');
    // localStorage.setItem('ampm', true);
    // localStorage.setItem('units', 'degF');
    // localStorage.setItem('zip', 80302);
  // }

  // user input
  const zip = localStorage.getItem('zip');
  const ampm = JSON.parse(localStorage.getItem('ampm'));
  const units = localStorage.getItem('units');
  const imgCategory = (localStorage.getItem('imgCategory'));

  // populate settings page with user input
  $('input[name=zip]').val(zip);
  if (ampm) {
    $('#12hr').addClass('active');
    $('#24hr').removeClass('active');
  }
  if (!ampm) {
    $('#24hr').addClass('active');
    $('#12hr').removeClass('active');
  }
  if (units === 'degF') {
    $('degF').addClass('active');
    $('degC').removeClass('active');
  }
  if (units === 'degC') {
    $('degF').addClass('active');
    $('degC').removeClass('active');
  }

  // $(`${imgCategory.toLowerCase()}`).addClass('active');
  // $(`input[value=${imgCategory}]`).prop('checked', true);

  // change background image based on user selected category
  $('body').css('background-image', `url('https://source.unsplash.com/category/${imgCategory}/1600x900')`);

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
    $('#current > #summary').text(currentSummary);
    skycons.play();
  };

  // display hourly forecast
  const displayHourlyForecast = function() {
    const forecastResponse =
      JSON.parse(localStorage.getItem('forecastResponse'));

    const hourlyForecast = [];

    // retreive forecast for each hour and store in array
    for (let i = 1; i < 5; i++) {
      const formatHour = function(hr) {
        if (ampm === true) {
          return (hr > 12) ? hr - 12 : hr;
        }

        return hr;
      };
      const unixTime = forecastResponse.hourly.data[i].time;
      const time = new Date(unixTime * 1000);
      const hour = formatHour(time.getHours());
      const hourlyPrecipProb =
        Math.round((forecastResponse.hourly.data[i].precipProbability) * 100);
      const hourlyTemp =
        Math.round(forecastResponse.hourly.data[i].apparentTemperature);
      const hourlyForecastObj = {
        precipProb: hourlyPrecipProb,
        temp: hourlyTemp,
        time: hour
      };

      hourlyForecast.push(hourlyForecastObj);
    }

    for (let i = 0; i < hourlyForecast.length; i++) {
      $(`#t${i + 1}hr`)
        .html(`<th scope="row">${hourlyForecast[i].time}:00</th>
        <td>${hourlyForecast[i].temp}\u00B0</td>
        <td>${hourlyForecast[i].precipProb}%</td>`);
    }
  };

  // display daily forecast
  const displayDailyForecast = function() {
    const forecastResponse =
      JSON.parse(localStorage.getItem('forecastResponse'));

    const dailyForecast = [];
    const skycons = new Skycons({
      color: '#f8f8f8'
    });

    // retreive forecast for each day and store in array
    for (let i = 1; i < 6; i++) {
      const formatDay = function(i) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday'
        ];

        return days[i];
      };
      const dailyHighTemp =
        Math.round(forecastResponse.daily.data[i].apparentTemperatureMax);
      const dailyIcon = forecastResponse.daily.data[i].icon;
      const dailyLowTemp =
        Math.round(forecastResponse.daily.data[i].apparentTemperatureMin);
      const unixTime = forecastResponse.daily.data[i].time;
      const time = new Date(unixTime * 1000);
      const forecastDay = formatDay(time.getDay());

      const dailyForecastObj = {
        day: forecastDay,
        highTemp: dailyHighTemp,
        icon: dailyIcon,
        lowTemp: dailyLowTemp
      };

      dailyForecast.push(dailyForecastObj);
    }

    for (let i = 0; i < dailyForecast.length; i++) {
      $(`#t${i + 1}d`)
        .html(`<th scope='row'>${dailyForecast[i].day}</th>
        <td><canvas id="icon_t+${i}d" width="25" height="25"></canvas></td>
        <td>${dailyForecast[i].highTemp}\u00B0</td>
        <td>${dailyForecast[i].lowTemp}\u00B0</td>`);
    }
    for (let i = 0; i < dailyForecast.length; i++) {
      skycons.add(`icon_t+${i}d`, dailyForecast[i].icon);
      skycons.play();
    }
  };

  // get weather data from forecast.io
  const queryForecast = function(lat, lon) {
    const $forecastIO = $.getJSON(`https://dailydash.herokuapp.com/${lat},${lon}?units=${units}&exclude=minutely,alerts,flags`);

    $forecastIO.done((data) => {
      if ($forecastIO.status !== 200) {
        return;
      }
      const rawData = JSON.stringify(data);

      localStorage.setItem('forecastResponse', rawData);
      displayCurrentConditions();
      displayHourlyForecast();
      displayDailyForecast();
    });
    $forecastIO.fail((err) => {
      return err;
    });
  };

  // get latitude and longitude from google geocode API
  const getLatLon = function(zip, units) {
    const $geocode = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyDRn-LQTI5bRG2k5CLE5elw8jgnthn20wk`);

    $geocode.done((data) => {
      if ($geocode.status !== 200) {
        return;
      }
      const lat = data.results[0].geometry.location.lat;
      const lon = data.results[0].geometry.location.lng;
      const city = data.results[0].address_components[1].long_name;
      const state = data.results[0].address_components[3].short_name;

      $('#location').text(`${city} | ${state}`);
      queryForecast(lat, lon, units);

      return;
    });
    $geocode.fail((err) => {
      return err;
    });
  };

  // get, format, display date and time
  const dateTime = function(ampm) {
    const formatDay = function(i) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'
      ];

      return days[i];
    };

    // ampm = true for 12 hour time, false for 24 hour time

    const formatHour = function(hr) {
      if (ampm === true) {
        return (hr > 12) ? hr - 12 : hr;
      }

      return hr;
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
  };

  const refreshWeatherData = function() {
    getLatLon(zip);
    setTimeout(refreshWeatherData, 6e5);
  };

  // save user input and refresh
  $('#save_changes').click(() => {
    // background image category
    // localStorage.setItem('imgCategory',
    // $('.imgCategory.active').text());

    localStorage.setItem('imgCategory',
    $('input:checked').val());

    // 12 or 24 hr time
    localStorage.setItem('ampm', $('#12hr').hasClass('active'));

    // temperature display
    if ($('#degF').hasClass('active')) {
      localStorage.setItem('units', 'us');
    }
    if ($('#degC').hasClass('active')) {
      localStorage.setItem('units', 'si');
    }

    // zipcode input
    localStorage.setItem('zip', $('input[name=zip]').val());

    refreshWeatherData();
    location.reload(true);
  });

  dateTime(ampm);
  refreshWeatherData(zip);
});
