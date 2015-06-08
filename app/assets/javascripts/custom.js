$(document).ready(function() {
  $(window).trigger("resize");

  var schedule_query_url = "/api/schedules.json";
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
    schedule_query_url = "/api/schedules.json?room_id=" + room_id;
    MyCalendar.fullCalendar("refetchEvents");
  });

  MyCalendar.fullCalendar({
    header: {
      left: "prev,next today",
      center: "title",
      right: "month,agendaWeek,agendaFourDay,agendaDay,agendaList"
    },
    views: {
      agendaFourDay: {
        type: "agenda",
        duration: {days: 4},
        buttonText: "4 days"
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

    eventResize: function(event, delta, revertFunc) {
      revertFunc();
    },

    eventDrop: function (event, dayta, revertFunc) {
      revertFunc();
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
      $(".popover").hide();
      time_start = "From: " + event.start.format("HH:mm");
      time_end = "To: " + event.end.format("HH:mm");
      room = "Room: " + event.room
      detail = "schedules/" + event.id
      edit = "schedules/" + event.id + "/edit"
      deleteRepeat = "repeats/" + event.repeat_id

      $(".title-popover").text(event.title);
      $(".start-time-popover").text(time_start);
      $(".finish-time-popover").text(time_end);
      $(".room-popover").text(room);
      $("#detail-schedule-popover").attr("href", detail);

      if (!event.url) {
        if(event.user_id == current_user_id) {
          if(event.repeat_id == null) {
            $("#delete-repeat-popover").attr("href", null);
            $("#delete-repeat-popover").text("");
          } else {
            $("#delete-repeat-popover").attr("href", deleteRepeat);
            $("#delete-repeat-popover").text("Delete all repeat");
          }

          $("#edit-schedule-popover").attr("href", edit);
          $("#edit-schedule-popover").text("Edit");
          $("#delete-schedule-popover").attr("href", detail);
          $("#delete-schedule-popover").text("Delete");

          element.popover({
            placement: "top",
            html: true,
            container: "body",
            content: $(".form-popover").html(),
          });
        } else {
          $("#edit-schedule-popover").attr("href", null);
          $("#edit-schedule-popover").text("");
          $("#delete-schedule-popover").attr("href", null);
          $("#delete-schedule-popover").text("");
          $("#delete-repeat-popover").attr("href", null);
          $("#delete-repeat-popover").text("");

          element.popover({
            placement: "top",
            html: true,
            container: "body",
            content: $(".form-popover").html(),
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
    },
    viewRender: function(view, element) {
      localStorage.setItem("view_type", view.type);
    },
    eventAfterAllRender: function (view, element) {
      MyCalendar.find(".fc-left").append($("#room_selector"));
    }
  });

  $("#modal-form").on("hidden.bs.modal", function(){
    $(this).find("form")[0].reset();
    $(".select-members").select2("val", "");
    $("#error_explanation").remove();
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
});
