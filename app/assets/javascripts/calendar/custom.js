$(document).ready(function() {
  $(window).trigger("resize");
  var schedule_query_url = "/api/schedules.json";
  var MyCalendar = $("#calendar");
  var MyMiniCalendar = $("#mini-calendar");
  var clock = 5*60;
  var quick_create_schedule = $("#popup");
  var schedule_start = $("#schedule_start_time");
  var schedule_finish = $("#schedule_finish_time");
  schedule_start.attr("readonly", "readonly");
  schedule_finish.attr("readonly", "readonly");

  var current_user_id = $("body").data("current-user-id");
  var view_type = localStorage.getItem("view_type");

  var getTime = function getTime(arg) {
   return new Date(arg.setTime(arg.getTime() + (arg.getTimezoneOffset() * 60000)))
  }

  $("#room_selector ul.dropdown-menu li").click(function(e) {
    room_id = $(this).val();
    if(room_id == 0){
      room_id = "";
    }
    room_name = $(this).find("span").text();
    schedule_query_url = "/api/schedules.json?room_id=" + room_id;
    MyCalendar.fullCalendar("refetchEvents");
    $("#room_dropdown").html(room_name);
    if(room_id != ""){
      $("#schedule_room_id option").removeAttr("selected");
      $("#schedule_room_id option[value="+room_id+"]").attr("selected", "selected");
      $("#select2-chosen-1").html(room_name);
    }
  });

  MyCalendar.fullCalendar({
    header: {
      left: "prev,next today",
      center: "title",
      right: "month,agendaWeek,agendaFourDay,agendaDay, timetable"
    },
    views: {
      agendaFourDay: {
        type: "agenda",
        duration: {days: 4},
        buttonText: "4 days"
      },
      timetable: {
        type: "custom",
        buttonText: "Time table",
      }
    },
    defaultView: view_type == "undefined" ? "month" : view_type,
    defaultDate: new Date(),
    editable: true,
    eventLimit: true,
    weekends: false,
    height: $(window).height() - $("header").height() - 50,
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
              var time_now = new Date();
              var end_time = new Date(schedule.finish_time);
              color = end_time < time_now ? "#B4B4CD" : schedule.room_color;
              events.push({
                id: schedule.id,
                title: schedule.title,
                description: schedule.description,
                start: schedule.start_time,
                end: schedule.finish_time,
                user_id: schedule.user_id,
                room: schedule.room_name,
                color: color,
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

      if((view.type != "month") && (start.date() == date.getDate())) {
        if((start.hour() > date.getHours()) || ((start.hour() == date.getHours()) && (start.minute() >= date.getMinutes()))) {
          quick_create_schedule.css({
            display: "block",
            top: event.pageY - 280,
            left: event.pageX,
          });
        } else {
          MyCalendar.fullCalendar("unselect");
          $("#popup").hide();
        }

        var start_event = getTime(start._d);
        var finish_event = getTime(end._d);

        schedule_start.val(formatDate(start_event));
        schedule_finish.val(formatDate(finish_event));
      } else if((view.type != "month") && (start._d > date)) {
        quick_create_schedule.css({
          display: "block",
          top:event.pageY - 280,
          left: event.pageX,
        });
        var start_event = getTime(start._d);
        var finish_event = getTime(end._d);

        schedule_start.val(formatDate(start_event));
        schedule_finish.val(formatDate(finish_event));
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

      delete_repeat = $("#delete-repeat-popover");
      edit_schedule = $("#edit-schedule-popover");
      delete_schedule = $("#delete-schedule-popover");

      if (!event.url) {
        if(event.user_id == current_user_id) {
          if(event.repeat_id == null) {
            delete_repeat.attr("href", null);
            delete_repeat.text("");
          } else {
            delete_repeat.attr("href", deleteRepeat);
            delete_repeat.text("Delete all repeat");
          }

          var time_now = new Date();
          var end_time = new Date(event.end);
          if(time_now > end_time) {
            edit_schedule.attr("href", null);
            edit_schedule.text("");
          }else {
            edit_schedule.attr("href", edit);
            edit_schedule.text("Edit");
          }

          delete_schedule.attr("href", detail);
          delete_schedule.text("Delete");

          element.popover({
            placement: "top",
            html: true,
            container: "body",
            content: $(".form-popover").html(),
          });
        } else {
          edit_schedule.attr("href", null);
          edit_schedule.text("");
          delete_schedule.attr("href", null);
          delete_schedule.text("");
          delete_repeat.attr("href", null);
          delete_repeat.text("");

          element.popover({
            placement: "top",
            html: true,
            container: "body",
            content: $(".form-popover").html(),
          });
        };

        $("body").on("click", function (e) {
          if($(".fc-more-popover").length == 1){
            localStorage.setItem("flag", true);
          }
          if($(".fc-more-popover").length == 0 && localStorage.getItem("view_type") == "month" && localStorage.getItem("flag") != null){
            localStorage.removeItem("flag");
            $(".popover").hide();
          }

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
        });

        $(".fc-content").click(function(){
          $(".popover").hide();
        });
        $(".datepicker").click(function(){
          $(".popover").hide();
        });
        element.click(function(){
          $("#popup").hide();
        });
      }
    },
    dayClick: function(date, jsEvent, view) {
      $("#search-setting").hide();
      $("#room_selector, #other_dropdown").removeClass("open");
      if((view.type == "month") && ((date.format() >= (new Date()).toISOString().slice(0, 10)) || (date._d >= (new Date())))) {
        quick_create_schedule.css({
          display: "block",
          top:event.pageY - 280,
          left: event.pageX,
        });

        var timezoned = new Date(date.toDate().setTime(date.toDate().getTime() + (date.toDate().getTimezoneOffset() * 60000)));
        var start_event = new Date(timezoned.setHours(8));
        var finish_event = new Date(timezoned.setMinutes(30));

        schedule_start.val(formatDate(start_event));
        schedule_finish.val(formatDate(finish_event));
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
      MyCalendar.find(".fc-right").append($("#other_dropdown"));
    },
    loading: function(isLoading, view){
      if (isLoading) {
        $("label.loading").removeClass("hidden");
      } else {
        $("label.loading").addClass("hidden");
      }
    }
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
    $(".popover").hide();
  });

  $(".fc-next-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
    $(".popover").hide();
  });

  $(".fc-today-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
  });

  $("#refresh").click(function(){
    $("#calendar").fullCalendar("refetchEvents");

    $.get("/api/my_schedules", function(data) {
      $("#my_schedules").html(data);
    });

    $.get("/api/shared_schedules", function(data) {
      $("#shared_schedules").html(data);
    });
  });

  setInterval(function(){
    var events = MyCalendar.fullCalendar("clientEvents");

    $.each(events, function (index, event){
      var time_now = new Date();
      var end_time = event.end._d;
      if (end_time < time_now) {
        event.color = "#B4B4CD"
      }
    });

    MyCalendar.fullCalendar("removeEvents");
    MyCalendar.fullCalendar("addEventSource", events);
    MyCalendar.fullCalendar("rerenderEvents");
  }, 900000);
});

function formatDate(date) {
  var date_of_month = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes;
  return strTime + " " + month + "/" + date_of_month + "/" + year;
};
