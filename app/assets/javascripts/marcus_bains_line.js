function setTimeLine() {
  if ($(".timeline").length === 0) {
    timeline = $("<hr>").addClass("timeline");
    $(".fc-time-grid-container").append(timeline);
  } else {
    timeline = $(".timeline");
  }

  now = new Date();
  hour = now.getHours();
  minHour = 7;
  maxHour = 22;

  if ($(".fc-today").length === 0 || hour < minHour || hour > maxHour) {
    timeline.hide();
  } else {
    height = $(".fc-slats").height();
    height_ratio = ((hour - minHour) * 3600 + now.getMinutes() * 60 + now.getSeconds()) / (maxHour - minHour) / 3600;
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
