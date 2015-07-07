// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//= require share/custom
//= require share/countdown_time.js
//= require_self
//= require validate-avatar
//= require kendo.web.min
//= require kendo.custom

$(document).ready(function() {
  var form_schedule = $(".new_schedule, .edit_schedule");

  form_schedule.find("input[type=submit]").attr("disabled", "disabled");
  form_schedule.areYouSure();
  form_schedule.bind("dirty.areYouSure", function(){
    $(this).find("input[type=submit]").removeAttr("disabled");
  });
  form_schedule.bind("clean.areYouSure", function(){
    $(this).find("input[type=submit]").attr("disabled", "disabled");
  });

  setTimeout(function() {
    $(".hide-flash").fadeOut("normal");
  }, 3000);
});
