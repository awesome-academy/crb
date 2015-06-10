function setTimeLine() {
  var left, top, width;

  if ($(".timeline").length === 0) {
    timeline = $("<hr>").addClass("timeline");
    $(".fc-slats").prepend(timeline);
  } else {
    timeline = $(".timeline");
  }

  now = moment();
  hour = now.hours();
  minHour = 7;
  maxHour = 22;

  if ($(".fc-today").length === 0 || hour < minHour || hour > maxHour) {
    timeline.hide();
  } else {
    height = $(".fc-slats").height();
    height_ratio = ((hour - minHour) * 3600 + now.minutes() * 60 + now.seconds()) / (maxHour - minHour) / 3600;
    width = $(".fc-today").outerWidth();
    left = $(".fc-today").position().left;
    top = height_ratio * height;

    timeline.css({
      "width": width + "px",
      "left": left + "px",
      "top": top + "px"
    });

    timeline.show();
  }
}
