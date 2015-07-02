function showRemaining() {
  var endDateElement = $("#end-date");

  if (endDateElement.length !== 0) {
    var endDate = new Date(endDateElement.val());

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;

    var now = new Date();
    var distance = endDate - now;

    if (distance < 0) {
      $("#countdown").html("EXPIRED");
      return;
    }

    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    ds = days > 1 ? " days, " : " day, ";
    dayString = days > 0 ? days + ds : "";
    hoursString = hours > 0 ? hours + " hour " : "";
    minuteString = minutes > 0 ? minutes + " minute " : "";

    var fulltime = dayString + hoursString + minuteString + seconds + " seconds";

    $("#countdown").html(fulltime);
  }
}

setInterval(showRemaining, 1000);
