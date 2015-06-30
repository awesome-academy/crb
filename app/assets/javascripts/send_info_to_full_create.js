$(document).ready(function() {
  $("a#editLink").click(function() {
    title = $("#schedule_title").val();
    start_time = $("#schedule_start_time").val().toString();
    finish_time = $("#schedule_finish_time").val().toString();
    href = "/schedules/new?title=" + title + "&start_time=" + start_time + "&finish_time=" + finish_time;
    $(this).attr("href", href);
  });
});
