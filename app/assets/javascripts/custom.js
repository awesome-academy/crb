$(document).ready(function() {
  $(window).trigger("resize");

  var schedule_query_url = "/schedules.json";
  var MyCalendar = $("#calendar");
  var MyMiniCalendar = $("#mini-calendar");

  setTimeout(function() {
    $(".hide-flash").fadeOut("normal");
  }, 4000);

  var current_user_id = $("body").data("current-user-id");
  var view_type = localStorage.getItem("view_type");

  function startChange() {
    var startDate = kendo_start.value(), endDate = kendo_finish.value();

    if (startDate) {
      startDate = new Date(startDate);
      startDate.setDate(startDate.getDate());
      kendo_finish.min(startDate);
    } else if (endDate) {
      kendo_start.max(new Date(endDate));
    } else {
      endDate = new Date();
      kendo_start.max(endDate);
      kendo_finish.min(endDate);
    }
  }

  function endChange() {
    var endDate = kendo_finish.value(), startDate = kendo_start.value();

    if (endDate) {
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate());
      kendo_start.max(endDate);
    } else if (startDate) {
      kendo_finish.min(new Date(startDate));
    } else {
      endDate = new Date();
      kendo_start.max(endDate);
      kendo_finish.min(endDate);
    }
  }

  $("#room_selector").change(function(){
    room_id = $(this).val();
    schedule_query_url = "/schedules.json?room_id=" + room_id;
    MyCalendar.fullCalendar("refetchEvents");
  });

  MyCalendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaFourDay,agendaDay,list'
    },
    
    views: {
      agendaFourDay: {
        type: "agenda",
        duration: {days: 4},
        buttonText: "4 days"
      },
      list:{
        type: 'basic',
        buttonText: 'Agenda'
      }
    },

    defaultView: view_type == "undefined" ? "month" : view_type,
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
    selectable: true,
    selectHelper: true,


    events: function(start, end, timezone, callback) {
      $.ajax({
        url: schedule_query_url,
        type: "GET",
        success: function(doc) {
          var events = [];
          if(doc.schedules){
            $.map(doc.schedules, function(schedule) {
              events.push({
                id: schedule.id,
                title: schedule.title,
                start: schedule.start_time,
                end: schedule.finish_time,
                user_id: schedule.user_id,
                room: schedule.room_name,
                color: schedule.room_color,
                repeat_id: schedule.repeat_id
              });
            });
          }
          callback(events);
        }
      });
    },
    select: function (start, end, jsEvent, view) {
      if((view.type != "month") && (start._d >= (new Date()))) {
        $("#modal-form").modal("show");
        var start_event = new Date(start._d.setTime(start._d.getTime() + (start._d.getTimezoneOffset() * 60000)));
        var finish_event = new Date(end._d.setTime(end._d.getTime() + (end._d.getTimezoneOffset() * 60000)));
        $("#schedule_start_time").kendoDateTimePicker({
          value: start_event,
          parseFormats: ["MM/dd/yyyy"],
          format: "yyyy-MM-dd HH:mm",
          timeFormat: "HH:mm",
        }).data("kendoDateTimePicker");
        $("#schedule_finish_time").kendoDateTimePicker({
          value: finish_event,
          parseFormats: ["MM/dd/yyyy"],
          format: "yyyy-MM-dd HH:mm",
          timeFormat: "HH:mm",
        }).data("kendoDateTimePicker");
      }
      else {
        MyCalendar.fullCalendar("unselect");
      }
    },
    eventRender: function (event, element) {
      time_start = "From: " + event.start.format("HH:mm") + "-";
      time_end = "To: " + event.end.format("HH:mm");

      btn_edit = "<a href='schedules/" + event.id + "/edit'>Edit</a>";
      btn_delete = "<a href='schedules/" + event.id + "' data-method='delete' data-confirm='You sure?'>Delete</a>";
      btn_delete_repeat = "<a href='repeats/" + event.repeat_id + "' data-method='delete' data-confirm='You sure?'>Delete all repeat</a>";
      btn_detail = "<a href='schedules/" + event.id + "'>Detail</a>"

      if (!event.url) {
        if(event.user_id == current_user_id) {
          var content = "<table><tr><td>" + btn_detail + "</td><td>" + btn_edit + "</td><td>" + btn_delete;
          if (event.repeat_id != null) {
              content += "</td><td>" + btn_delete_repeat + "</td></tr></table>";
          }else {
            content += "</td></tr></table>";
          }
          element.popover({
            placement: "top",
            html: true,
            container: "body",
            title: "<b>" + event.title + "</b><br/><br/>" + time_start + time_end + "</br>Room: " + event.room,
            content: content,
          });
        } else {
          element.popover({
            placement: "top",
            html: true,
            container: "body",
            title: "<b>" + event.title + "</b><br/><br/>" + time_start + time_end + "</br>Room: " + event.room,
            content: "<table><tr><td>" + btn_detail + "</td></tr></table>",
          });
        };
        $("body").on("click", function (e) {
          if (!element.is(e.target) && element.has(e.target).length == 0 && $(".popover").has(e.target).length == 0)
          element.popover("hide");
        });
      }
    },
    dayClick: function(date, jsEvent, view) {
      if((view.type == "month" && date.format() >= (new Date()).toISOString().slice(0, 10)) || date._d >= (new Date())) {
        $("#modal-form").modal("show");
        var TimeZoned = new Date(date.toDate().setTime(date.toDate().getTime() + (date.toDate().getTimezoneOffset() * 60000)));
        var kendo_start = $("#schedule_start_time").kendoDateTimePicker({
          value: TimeZoned,
          min: new Date(),
          change: MyCalendar.fullCalendar.trigger("startChange"),
          parseFormats: ["MM/dd/yyyy"],
          format: "yyyy-MM-dd HH:mm",
          timeFormat: "HH:mm",
          open: function() {
            $(".k-weekend a").bind("click", function() {
              return false;
            });
          },
        }).data("kendoDateTimePicker");
        var kendo_finish = $("#schedule_finish_time").kendoDateTimePicker({
          value: TimeZoned,
          change: MyCalendar.fullCalendar.trigger("endChange"),
          parseFormats: ["MM/dd/yyyy"],
          format: "yyyy-MM-dd HH:mm",
          timeFormat: "HH:mm",
          open: function() {
            $(".k-weekend a").bind("click", function() {
              return false;
            });
          },
        }).data("kendoDateTimePicker");

        kendo_finish.min(kendo_start.value());
      }

      $('.fc-view').show();
      $('.fc-next-button').show();
      $('.fc-prev-button').show();
      $('.fc-today-button').css('visibility','visible');
      $('#room_selector').css('visibility','visible');
      $('.agenda-list').css('visibility', 'hidden');
    },

    viewRender: function(view, element) {
      localStorage.setItem("view_type", view.type);
      $('.fc-view').show();
      $('.fc-next-button').show();
      $('.fc-prev-button').show();
      $('.fc-today-button').css('visibility','visible');
      $('#room_selector').css('visibility','visible');
      $('.agenda-list').css('visibility', 'hidden');
    },
    eventAfterAllRender: function (view, element) {
      MyCalendar.find(".fc-left").append($("#room_selector"));
    }
  });

  $("#modal-form").on("hidden.bs.modal", function(){
    $(this).find("form")[0].reset();
    $(".select-members").select2("val", "");
    $("#error_explan  ation").remove();
  });

  var kendo_start = $("#schedule_start_time").kendoDateTimePicker({
    min: new Date(),
    change: startChange,
    parseFormats: ["MM/dd/yyyy"],
    format: "yyyy-MM-dd HH:mm",
    timeFormat: "HH:mm",
    open: function() {
      $(".k-weekend a").bind("click", function() {
        return false;
      });
    },
  }).data("kendoDateTimePicker");

  var kendo_finish = $("#schedule_finish_time").kendoDateTimePicker({
    change: endChange,
    parseFormats: ["MM/dd/yyyy"],
    format: "yyyy-MM-dd HH:mm",
    timeFormat: "HH:mm",
    open: function() {
      $(".k-weekend a").bind("click", function() {
        return false;
      });
    },
  }).data("kendoDateTimePicker");

  kendo_start.max(kendo_finish.value());
  kendo_finish.min(kendo_start.value());

  $(".select-room").select2({
    width: 300
  });

  $(".select-members").select2({
    width: "100%"
  });

  MyMiniCalendar.datepicker({
    inline: true,
    sideBySide: true,
    todayHighlight: true,
    showButtonPanel: true,
  }).on("changeDate", function(ev){
    MyCalendar.fullCalendar("gotoDate", new Date(Date.parse(ev.date)));
    MyCalendar.fullCalendar("changeView","month");
    MyCalendar.fullCalendar("changeView","agendaDay");
  });

  $(".fc-prev-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
  });

  $(".fc-next-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
  });

  $(".fc-today-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
  });

  $('.fc-list-button').click(function(){
    $('.fc-view').hide();
    $('.agenda-list').css('visibility', 'visible'); 

    $('.fc-next-button').hide();
    $('.fc-prev-button').hide();
    $('.fc-today-button').css('visibility','hidden');
    $('#room_selector').css('visibility','hidden');   
  });
  
  $('.plus').click(function(){
    $("#event-" + $(this).data("event-id")).slideToggle();
  });

  $('.expand').click(function(){
    $('.s-detail').slideDown();
  });

  $('.coll').click(function(){
    $('.s-detail').slideUp();
  })
}); 
