function showRemaining() {
    var date = document.getElementById("date_time_event").value;
    var start_time_event = document.getElementById("start_time_event").value;

    var end = new Date(date + " " + start_time_event);

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    var now = new Date();
    var distance = end - now;
    
    if (distance < 0) {
        clearInterval(timer);
        document.getElementById('countdown').innerHTML = 'EXPIRED';
        return;
    }

    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);
    
    dayString = days > 0 ? days + ' day ' : "";
    hoursString = hours > 0 ? hours + ' hour ' : "";
    minuteString = minutes > 0 ? minutes + ' minute ' : "";

    var fulltime = dayString + hoursString + minuteString + seconds + ' seconds';
    
    document.getElementById('countdown').innerHTML = fulltime;
}

timer = setInterval(showRemaining, 1000);