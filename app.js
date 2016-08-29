$(document).ready(function() {
  //get, format, display date and time
  (function() {
    let today = new Date()

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
      let day = formatDay(today.getDay());
      let date = today.getDate();
      let month = formatMonth(today.getMonth());
      let year = today.getFullYear();
      $('#date').text(`${day} | ${month} ${date}, ${year}`);
    }

    function getTime() {
      hr = formatHour(today.getHours()),
        min = formatTime(today.getMinutes()),
        sec = formatTime(today.getSeconds()); //time display breaks if seconds is removed. Needed for setTimeout?
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
//   (function() {
//     console.log('Before AJAX');
//     let $weather_data = $.getJSON('https://api.forecast.io/forecast/679f361d95ab79e1c8e2aa37494fa86d/40.055550,-105.208595');
//     $weather_data.done(function(data) {
//       if ($xhr.status !== 200) {
//         return;
//       }
//       console.log('Hello');
//       console.log(data['summary']);
//       console.log(data['apparentTemperature']);
//     });
//     $weather_data.fail(function(err) {
//     console.log(err);
// });
//   })();


})
