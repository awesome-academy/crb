
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
    }
  });

  $(".datepicker").datetimepicker({
    sideBySide: true,
    daysOfWeekDisabled: [0, 6],
    dayViewHeaderFormat: 'DD - MM - YYYY'
  });

  $('#schedule_room_id').select2({
    width: 300
  });
});
