function setTimeLine() {
  if ($(".timeline").length === 0) {
    timeline = $("<hr>").addClass("timeline");
    $(".fc-time-grid-container").append(timeline);
  } else {
    timeline = $(".timeline");
  }

  now = new Date();
  minHour = 7;
  maxHour = 22;
  nowTotalSeconds = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
  maxTotalSeconds = (maxHour * 3600);
  minTotalSeconds = (minHour * 3600);

  if ($(".fc-today").length === 0 || nowTotalSeconds > maxTotalSeconds || nowTotalSeconds < minTotalSeconds) {
    timeline.hide();
  } else {
    height = $(".fc-slats").height();
    height_ratio = (nowTotalSeconds - minTotalSeconds) / (maxHour - minHour) / 3600;
    setSize();
    $(window).resize(function(){
      setSize();
    });
    timeline.show();
  }
}

function setSize() {
  var left, top, width;
  width = $(".fc-today").outerWidth();
  left = $(".fc-today").position().left;
  top = height_ratio * height;
  timeline.css({
    "width": width + "px",
    "left": left + "px",
    "top": top + "px"
  });
}
