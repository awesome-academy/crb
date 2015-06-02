$(document).ready(function() {
  $("#my_calendar").click(function(){
    $(".menu_my_calendar").slideToggle();
  });

  $("#shared_calendar").click(function(){
    $(".menu_shared_calendar").slideToggle();
  });

  $.get( "/api/shared_schedules", function(data) {
    $("#shared_schedules").html(data);
  });

  $.get( "/api/my_schedules", function(data) {
    $("#my_schedules").html(data);
  });
});
