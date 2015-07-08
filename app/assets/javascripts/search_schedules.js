$(document).ready(function() {
  var search_setting = $("#search-setting");
  var start_date = $("#start_date");
  var finish_date = $("#end_date");

  start_date.datepicker({
    format: "dd/mm/yyyy"
  });

  finish_date.datepicker({
    format: "dd/mm/yyyy"
  });

  $("#btn-setting").on("click", function() {
    start_date.datepicker().val("");
    finish_date.datepicker().val("");
    $("#search_form_room_id").val("");
    if (search_setting.css("visibility") === "hidden") {
      $(".search-warning").css({"visibility": "hidden"});
      search_setting.css({"visibility": "visible"});
    } else {
      search_setting.css({"visibility": "hidden"});
    }
  });

  $("#adv-search").on("click", function(e) {
    e.stopPropagation();
    $(".popover").hide();
  });

  $("body").on("click", function() {
    search_setting.css({"visibility": "hidden"});
    $(".search-warning").css({"visibility": "hidden"});
  });

  $(".btn-search").on("click", function() {
    var title = $("#search_form_title_cont").val();
    if(title === ""){
      $(".search-warning").css({"visibility": "visible"});
      return false;
    }
    else
      $(".search-warning").css({"visibility": "hidden"});
  });

  $("#search_form_title_cont").on("click", function() {
    $(".search-warning").css({"visibility": "hidden"});
  });

});
