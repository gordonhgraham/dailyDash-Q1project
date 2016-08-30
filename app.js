$(document).ready(function() {
  //get, format, display date and time
  (function() {

    function formatDay(i) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[i];
    }
    //turn off if user selects 24 hour time display
    function formatHour(h) {
      return (h > 12) ? h - 12 : h;
    }

    function formatMonth(j) {
      const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      return months[j];
    }

    function formatTime(i) {
      return (i < 10) ? "0" + i : i;
    }

    function getDate() {
      let today = new Date()
      let day = formatDay(today.getDay());
      let date = today.getDate();
      let month = formatMonth(today.getMonth());
      let year = today.getFullYear();
      $('#date').text(`${day} | ${month} ${date}, ${year}`);
    }

    function getTime() {
      let today = new Date()
      let hr = formatHour(today.getHours());
      let min = formatTime(today.getMinutes());
      $('#time').text(hr + ":" + min)
      t = setTimeout(function() {
        getTime();
        getDate();
      }, 500);
    }

    getDate();
    getTime();
  })();

  //current weather
  (function() {
    let $weather_data = $.getJSON('https://dailydash.herokuapp.com/40.055550,-105.208595');
    $weather_data.done(function(data) {
      if ($weather_data.status !== 200) {
        return;
      }
      let current_temp = Math.round(data.currently.apparentTemperature);
      $('#temp > h1').text(`${current_temp}\u00B0`);
    });

    $weather_data.fail(function(err) {
      console.log(err);
    });
  })();
})
