function setTimeLine() {
  var top;

  if ($(".timeline").length === 0 && localStorage.getItem("view_type") != "month") {
    timeline = $("<hr>").addClass("timeline");
    $(".fc-today").append(timeline);
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
    top = height_ratio * height;

    timeline.css({
      "top": top + "px"
    });

    timeline.show();
  }
}
