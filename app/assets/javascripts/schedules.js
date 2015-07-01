$(document).ready(function() {
  $(document).on("click", "#my_calendar .title, #shared_calendar .title", function(e) {
    changeState($(e.target.parentElement.children[1]));
  });

  $.get( "/api/shared_schedules", function(data) {
    $("#shared_schedules").html(data);
  });

  $.get( "/api/my_schedules", function(data) {
    $("#my_schedules").html(data);
  });

  function changeState(element) {
    var icon = element.parent().find("span.glyphicon:first");
    var isValid = element.attr("class") === "slide_down";

    element.attr("class", isValid ? "slide_up" : "slide_down");
    icon.attr("class", isValid ? "glyphicon glyphicon-chevron-right" : "glyphicon glyphicon-chevron-down");
    element.slideToggle();
  };
});
