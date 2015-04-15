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
    defaultDate: new Date(), //'2015-02-12'
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    weekends: false,
    height: $(window).height() - $("header").height() - $("footer").height() - 100,
    events: [
      {
        title: 'All Day Event',
        start: '2015-02-01'
      },
      {
        title: 'Long Event',
        start: '2015-02-07',
        end: '2015-02-10'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2015-02-09T16:00:00'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2015-02-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2015-02-11',
        end: '2015-02-13'
      },
      {
        title: 'Meeting',
        start: '2015-02-12T10:30:00',
        end: '2015-02-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2015-02-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2015-02-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2015-02-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2015-02-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2015-02-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2015-04-14'
      }
    ]
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

