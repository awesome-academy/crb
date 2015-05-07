$(document).ready(function() {
  var current_user_id = $('body').data('current-user-id');
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaFourDay,agendaDay'
    },
    views: {
      agendaFourDay: {
        type: 'agenda',
        duration: { days: 4 },
        buttonText: '4 day'
      }
    },
    defaultView: 'month',
    defaultDate: new Date(),
    editable: true,
    eventLimit: true,
    weekends: false,
    height: $(window).height() - $("header").height() - $("footer").height() - 60,
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
                end: schedule.finish_time,
                user: schedule.user_id,
                room: schedule.room_id,
              });
            });
          }
          callback(events);
        }
      });
    },
    eventRender: function (event, element) {
      time_start = "From: " + event.start.format('HH:mm') + "<br/>";
      time_end = "To: " + event.end.format('HH:mm');
      
      btn_edit = "<a href='schedules/" + event.id + "/edit'>Edit</a>";
      btn_delete = "<a href='schedules/" + event.id + "' data-method='delete' data-confirm='You sure?'>Delete</a>"; 
      btn_detail = "<a href='schedules/" + event.id + "'>Detail</a>"
      if (!event.url) {
        if(event.user == current_user_id) {
          element.popover({
            placement: 'top',
            html:true,                        
            title: "<b>Title: " + event.title + "</b><br/><br/>" + time_start + time_end + "</br>Room: " + event.room,
            content: "<table style='border-style:hidden;'><tr><th>" + btn_detail + "</th><th>" + btn_edit + "</th><th>" + btn_delete + "</th></tr></table>",
          });
        }else {
          element.popover({
            placement: 'top',
            html:true,                        
            title: "<b>Title: " + event.title + "</b><br/><br/>" + time_start + time_end + "</br>Room: " + event.room,
            content: "<table style='border-style:hidden;'><tr><th>" + btn_detail + "</th></tr></table>",
          });
        };
        $('body').on('click', function (e) {
          if (!element.is(e.target) && element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
          element.popover('hide');
        });
      }           
    },
    dayClick: function(date, jsEvent, view) {
      $("#modal-form").modal('show');
      var TimeZoned = new Date(date.toDate().setTime(date.toDate().getTime() + (date.toDate().getTimezoneOffset() * 60000)));
      $('#start-time').datetimepicker('setDate', TimeZoned);
    },
  });

  $("#modal-form").on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
    $(".select-members").select2("val", "");
  });

  $('#start-time').datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    autoclose: true,
    pickerPosition: "bottom-left",
    maxView: 9,
    minuteStep: 15,
    startDate: new Date(),
    daysOfWeekDisabled: '0,6'
  }).on("changeDate", function (e) {
    var TimeZoned = new Date(e.date.setTime(e.date.getTime() + (e.date.getTimezoneOffset() * 60000)));
    $('#start-time').datetimepicker('setDate', TimeZoned);
  });

  $('#finish-time').datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    autoclose: true,
    pickerPosition: "bottom-left",
    maxView: 9,
    minuteStep: 15,
    startDate: new Date(),
    daysOfWeekDisabled: '0,6'
  }).on("changeDate", function (e) {
    var TimeZoned = new Date(e.date.setTime(e.date.getTime() + (e.date.getTimezoneOffset() * 60000)));
    $('#finish-time').datetimepicker('setDate', TimeZoned);
  });

  $('.select-room').select2({
    width: 300
  });

  $('.select-members').select2({
    width: "100%"
  });
});
