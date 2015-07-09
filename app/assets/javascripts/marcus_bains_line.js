function setTimeLine() {
  var timeline, now, minHour, maxHour, nowTotalSeconds, maxTotalSeconds, minTotalSeconds;

  if ($(".timeline").length === 0) {
    timeline = $("<hr>").addClass("timeline");
    $(".fc-time-grid-container").append(timeline);
  } else {
    timeline = $(".timeline");
  }

  now = new Date();
  minHour = 7;
  maxHour = 21;
  nowTotalSeconds = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
  maxTotalSeconds = (maxHour * 3600);
  minTotalSeconds = (minHour * 3600);

  if ($(".fc-today").length === 0 || nowTotalSeconds > maxTotalSeconds || nowTotalSeconds < minTotalSeconds) {
    timeline.hide();
  } else {
    var height, height_ratio;
    height = $(".fc-slats").height();
    height_ratio = (nowTotalSeconds - minTotalSeconds) / (maxHour - minHour) / 3600;
    setSize(height, height_ratio);
    $(window).resize(function(){
      setSize(height, height_ratio);
    });
    timeline.show();
  }
}

function setSize(height, height_ratio){
  var width, left;
  width = $(".fc-today").outerWidth();
  left = $(".fc-today").position().left;
  $(".timeline").css({
    "width": width + "px",
    "left": left + "px",
    "top": height_ratio * height + "px"
  });
}
