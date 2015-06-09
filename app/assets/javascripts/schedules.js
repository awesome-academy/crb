$(document).ready(function() {
  $("#my_calendar .title").click(function(){
    changeState($("#my_schedules"));
  });

  $("#shared_calendar .title").click(function(){
    changeState($("#shared_schedules"));
  });

  $.get( "/api/shared_schedules", function(data) {
    $("#shared_schedules").html(data);
  });

  $.get( "/api/my_schedules", function(data) {
    $("#my_schedules").html(data);
  });
});

function changeState(element) {
  element.slideToggle();
  var icon = element.parent().find("span.glyphicon:first");

  if (element.attr("class") == "slide_down") {
    element.attr("class", "slide_up");
    icon.removeClass("glyphicon-chevron-down");
    icon.addClass("glyphicon-chevron-right")
  } else {
    element.attr("class", "slide_down");
    icon.removeClass("glyphicon-chevron-right");
    icon.addClass("glyphicon-chevron-down")
  }
};
