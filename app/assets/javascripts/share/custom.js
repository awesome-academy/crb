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
//= require jquery
//= require_self
//= require bootstrap-datepicker
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require bootstrap
//= require websocket_rails/main
//= require select2
//= require search_schedules
//= require repeats
//= require jquery.are-you-sure
//= require share/notify
//= require moment

var schedule_start_time, schedule_finish_time;

$(document).ready(function() {
  $(".select-room").select2({
    width: 300
  });

  $(".select-members").select2({
    width: "100%"
  });

  $("input:checkbox").click(function(){
    if($(this).is(":checked")){
      $("input:checkbox").not(this).prop("checked", false);
    }
  });
});
