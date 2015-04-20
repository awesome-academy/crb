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
    minTime: "07:00:00",
    maxTime: "22:00:00",
    allDaySlot: false,
    editable: true,
    eventLimit: true,
    keepOpen: false,
    events: function(start, end, timezone, callback) {
      $.ajax({
        url: '/schedules.json',
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
    },
    dayClick: function(date, jsEvent, view) {
      $(".modal").modal('show');
    },
  });

  $('#start-time').datetimepicker({
    format: 'mm/dd/yyyy hh:ii',
    autoclose: true,
    pickerPosition: "bottom-left",
    maxView: 9,
    minuteStep: 15,
    startDate: new Date()
  }).on("changeDate", function (e) {
    var TimeZoned = new Date(e.date.setTime(e.date.getTime() + (e.date.getTimezoneOffset() * 60000)));
    // $('#schedule_start_time').datetimepicker('setStartDate', TimeZoned);
    $('#start-time').datetimepicker('setDate', TimeZoned);
  });

  $('#finish-time').datetimepicker({
    format: 'mm/dd/yyyy hh:ii',
    autoclose: true,
    pickerPosition: "bottom-left",
    maxView: 9,
    minuteStep: 15,
    startDate: new Date()
  }).on("changeDate", function (e) {
    var TimeZoned = new Date(e.date.setTime(e.date.getTime() + (e.date.getTimezoneOffset() * 60000)));
    // $('#finish-time').datetimepicker('setEndDate', TimeZoned);
    // $('#schedule_finish_time').datetimepicker('setDate', TimeZoned);
    $('#finish-time').datetimepicker('setDate', TimeZoned);
  });


  $('.select-room').select2({
    width: 300
  });

  $('.select-members').select2({
    width: "100%"
  });
});
