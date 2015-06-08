$(document).ready(function() {
  $("#my_calendar").click(function(){
    changeState($("#my_schedules"));
  });

  $("#shared_calendar").click(function(){
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
  var icon = element.parent().find("span.glyphicon");

  if (element.attr("class") == "expand") {
    element.attr("class", "collapse");
    icon.removeClass("glyphicon-chevron-down");
    icon.addClass("glyphicon-chevron-right")
  } else {
    element.attr("class", "expand");
    icon.removeClass("glyphicon-chevron-right");
    icon.addClass("glyphicon-chevron-down")
  }
};
