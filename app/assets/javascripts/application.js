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
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require bootstrap
//= require moment
//= require fullcalendar
//= require bootstrap-datepicker
//= require websocket_rails/main

$(document).ready(function() {
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    defaultView: 'month',
    defaultDate: new Date(),
    editable: true,
    eventLimit: true,
    weekends: false,
    height: $(window).height() - $("header").height() - $("footer").height() - 100,
    minTime: "08:00:00",
    maxTime: "17:00:00",
    allDaySlot: false,
    editable: true,
    eventLimit: true,
    events: function(start, end, timezone, callback) {
      $.ajax({
        url: '/schedules',
        type: 'GET',
        success: function(doc) {
          var events = [];
          if(doc.schedules){
            $.map(doc.schedules, function(schedule) {
              events.push({
                id: schedule.id,
                title: schedule.title,
                start: schedule.start_time,
                end: schedule.finish_time
              });
            });
          }
          callback(events);
        }
      });
    }
  });

  $('#datepicker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    clearBtn: true,
    daysOfWeekDisabled: [0,6],
    todayBtn: true,
    todayHighlight: true,
    startDate: 'Beginning of time'
  });
});