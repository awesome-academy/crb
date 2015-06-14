$(document).ready(function() {
  $(window).trigger("resize");
  var schedule_query_url = "/api/schedules.json";
  var MyCalendar = $("#calendar");
  var MyMiniCalendar = $("#mini-calendar");
  var clock = 5*60;

  setTimeout(function() {
    $(".hide-flash").fadeOut("normal");
  }, 4000);

  var current_user_id = $("body").data("current-user-id");
  var view_type = localStorage.getItem("view_type");

  var getTime = function getTime(arg) {
   return new Date(arg.setTime(arg.getTime() + (arg.getTimezoneOffset() * 60000)))
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
      right: "month,agendaWeek,agendaFourDay,agendaDay"
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
    keepOpen: false,
    unselectAuto: false,
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
      var date = new Date();
      if((view.type != "month") && (start._d >= date)) {
        if((start.hour() > date.getHours()) || ((start.hour() == date.getHours()) && (start.minute() >= date.getMinutes()))){
          $("#modal-form").modal("show");
        }else{
          MyCalendar.fullCalendar("unselect");
        }

        var start_event = getTime(start._d);
        var finish_event = getTime(end._d);

        schedule_start_time.value(start_event);
        schedule_finish_time.value(finish_event);

        schedule_start_time.max(schedule_finish_time.value());
        schedule_finish_time.min(schedule_start_time.value());
      } else {
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

          if($(".fc-popover").length == 1){
            $(".fc-icon-x").click(function(){
              element.popover("hide");
            });
          }
          $(".popover").click(function(){
            $(this).hide();
          });
      }
    },
    dayClick: function(date, jsEvent, view) {
      if((view.type == "month") && ((date.format() >= (new Date()).toISOString().slice(0, 10)) || (date._d >= (new Date())))) {
        $("#modal-form").modal("show");
        $(".popover").hide();
        var TimeZoned = new Date(date.toDate().setTime(date.toDate().getTime() + (date.toDate().getTimezoneOffset() * 60000)));

        schedule_start_time.value(TimeZoned);
        schedule_finish_time.value(TimeZoned);

        schedule_start_time.max(schedule_finish_time.value());
        schedule_finish_time.min(schedule_start_time.value());
      }
      $(".popover").hide();
    },
    viewRender: function(view, element) {
      localStorage.setItem("view_type", view.type);

      try {
        setTimeLine();
        setInterval(function(){ setTimeLine() }, clock*1000);
      } catch (err) {}
    },
    eventAfterAllRender: function (view, element) {
      MyCalendar.find(".fc-left").append($("#room_selector"));
      MyCalendar.find(".fc-right").append($("#other_selector"));
    }
  });

  $("#modal-form").on("hidden.bs.modal", function(){
    $(this).find("form")[0].reset();
    $(".select-members").select2("val", "");
    $("#error_explanation").remove();
    MyCalendar.fullCalendar("unselect");
  });

  $("#modal-form").on("show.bs.modal", function(){
    $(".popover").hide();
  });


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
    MyCalendar.fullCalendar("changeView", "month");
    MyCalendar.fullCalendar("changeView", "agendaDay");
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

  $("#other_selector").click(function(){
    if ($("#other_selector").val() == "Refresh") {
      $.get( "/api/my_schedules", function(data) {
        $("#my_schedules").html(data);
      });

      $.get( "/api/shared_schedules", function(data) {
       $("#shared_schedules").html(data);
      });

      $("#calendar").fullCalendar("refetchEvents");
    }
  });
});
