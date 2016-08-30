$(document).ready(() => {
  'use strict';

  // strict mode
  // get, format, display date and time
  (function() {
    const formatDay = function(i) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      return days[i];
    };

    // turn off if user selects 24 hour time display
    const formatHour = function(hr) {
      return (hr > 12) ? hr - 12 : hr;
    };

    const formatMonth = function(j) {
      const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

      return months[j];
    };

    const formatTime = function(i) {
      return (i < 10) ? `'0'${i}` : i;
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

  // current temperature
  (function() {
    const $weatherData = $.getJSON('https://dailydash.herokuapp.com/40.055550,-105.208595');

    $weatherData.done((data) => {
      if ($weatherData.status !== 200) {
        return;
      }
      const currentTemp = Math.round(data.currently.apparentTemperature);

      $('#temp > h1').text(`${currentTemp}\u00B0`);

      // get info for current conditions
      // get info for forecast
    });

    $weatherData.fail((err) => {
      return err;

      // console.log(err);
    });
  })();
});
