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
    if (search_setting.css("display") == "none") {
      search_setting.show();
    } else {
      search_setting.hide();
    }
  });

  $("#adv-search").on("click", function(e) {
    e.stopPropagation();
  });

  $("body").on("click", function() {
    search_setting.hide();
  });
});
