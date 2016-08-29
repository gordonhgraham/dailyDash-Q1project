$(document).ready(function() {
    //
    // function getDateTime() {
    //     let today = new Date();
    //     let min = today.getMinutes();
    //     let hr = today.getHours();
    //     let day = today.getDay();
    //     let date = today.getDate();
    //     let month = today.getMonth();
    //     let year = today.getFullYear();
    //   }
    //
    //   let displayDateTime = function() {
    //     $('#date_time > h1').text();
    //   }
    //
    // displayDateTime();


    (function() {
        function formatTime(i) {
            return (i < 10) ? "0" + i : i;
        }
        //turn off if user selects 24 hour time display
        function formatHour(h) {
          return (h > 12) ? h-12 : h;
        }

        function getTime() {
            var today = new Date(),
                hr = formatHour(today.getHours()),
                min = formatTime(today.getMinutes()),
                sec = formatTime(today.getSeconds()); //time display breaks if seconds is removed. Needed for setTimeout?
            $('#date_time > h1').text(hr + ":" + min)
            t = setTimeout(function() {
                getTime()
            }, 500);
        }
        getTime();
    })();





})
