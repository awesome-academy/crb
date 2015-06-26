$(document).ready(function() {
  $(window).trigger("resize");
  var schedule_query_url = "/api/schedules.json";
  var MyCalendar = $("#calendar");
  var MyMiniCalendar = $("#mini-calendar");

  var EventPopup = $("#quick-event-popup");
  var PongPopup = $("#prong");
  var SchedulePopup = $(".form-popover");
  var PongPopupEven = $("#prong_event");

  var clock = 5 * 60;

  var current_user_id = $("body").data("current-user-id");
  var view_type = localStorage.getItem("view_type");

  var getTime = function getTime(arg) {
   return new Date(arg.setTime(arg.getTime() + (arg.getTimezoneOffset() * 60000)))
  }

  $("#room_selector ul.dropdown-menu li").click(function(e) {
    room_id = $(this).val();
    if (room_id == 0) {
      room_id = "";
    }

    room_name = $(this).find("span").text();
    schedule_query_url = "/api/schedules.json?room_id=" + room_id;
    MyCalendar.fullCalendar("refetchEvents");
    $("#room_dropdown").html(room_name);

    if (room_id != "") {
      $("#schedule_room_id option").removeAttr("selected");
      $("#schedule_room_id option[value=" + room_id + "]").attr("selected", "selected");
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
      SchedulePopup.css({"visibility": "hidden"});
      if (view.type != "month") {
        date = new Date();

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        popupWidth = EventPopup.width();
        popupHeight = EventPopup.height();
        clientX = jsEvent.clientX;
        clientY = jsEvent.clientY;
        selectedElementHeight = $(jsEvent.toElement.parentElement).height();
        _left = 0;

        if ((clientX + popupWidth * 1/2 + 30) > windowWidth) {
          _left = windowWidth - popupWidth - 5;
          _leftPong = clientX + popupWidth - windowWidth;
          PongPopup.css({"left": _leftPong});
        } else {
          _left = clientX - popupWidth * 1/2;
          PongPopup.css({"left": 182});
        }

        _top = clientY - popupHeight - selectedElementHeight;

        if (_top < 5) {
          _top = clientY - 80 + selectedElementHeight * 1/2;
          PongPopup.removeClass("bottom-prong").addClass("top-prong");
        } else {
          _top = _top - 80 + selectedElementHeight * 1/2;
          PongPopup.removeClass("top-prong").addClass("bottom-prong");
        }

        if (start.date() == date.getDate()) {
          if ((start.hour() > date.getHours()) || ((start.hour() == date.getHours()) && (start.minute() >= date.getMinutes()))) {
            // $("#modal-form").modal("show");

            EventPopup.css({"visibility": "visible", "left": _left, "top": _top});
          } else {
            MyCalendar.fullCalendar("unselect");
          }

          start_event = getTime(start._d);
          finish_event = getTime(end._d);

          schedule_start_time.max(finish_event);
          schedule_finish_time.min(start_event);

          schedule_start_time.value(start_event);
          schedule_finish_time.value(finish_event);
        } else if (start._d > date) {
          // $("#modal-form").modal("show");
          EventPopup.css({"visibility": "visible", "left": _left, "top": _top});

          start_event = getTime(start._d);
          finish_event = getTime(end._d);

          schedule_start_time.max(finish_event);
          schedule_finish_time.min(start_event);

          schedule_start_time.value(start_event);
          schedule_finish_time.value(finish_event);
        } else {
          MyCalendar.fullCalendar("unselect");
        }
      }
    },

    eventClick: function( event, jsEvent, view ) {
      EventPopup.css({"visibility": "hidden"});

      if (event.id != undefined) {
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

        if (event.user_id == current_user_id) {
          if (event.repeat_id == null) {
            delete_repeat.attr("href", null);
            delete_repeat.text("");
          } else {
            delete_repeat.attr("href", deleteRepeat);
            delete_repeat.text("Delete all repeat");
          }

          var time_now = new Date();
          var end_time = new Date(event.end);

          if (time_now > end_time) {
            edit_schedule.attr("href", null);
            edit_schedule.text("");
          } else {
            edit_schedule.attr("href", edit);
            edit_schedule.text("Edit");
          }

          delete_schedule.attr("href", detail);
          delete_schedule.text("Delete");
        } else {
          edit_schedule.attr("href", null);
          edit_schedule.text("");
          delete_schedule.attr("href", null);
          delete_schedule.text("");
          delete_repeat.attr("href", null);
          delete_repeat.text("");
        };

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        popupWidth = SchedulePopup.width();
        popupHeight = SchedulePopup.height();
        clientX = jsEvent.clientX;
        clientY = jsEvent.clientY;
        _left = 0;
        _top = 0;

        if ((clientX + popupWidth * 1/2 + 30) > windowWidth) {
          _left = windowWidth - popupWidth - 40;
          _leftPong = clientX + popupWidth - windowWidth;
          PongPopupEven.css({"left": _leftPong});
        } else {
          _left = clientX - popupWidth * 1/2;
          PongPopupEven.css({"left": 115});
        }

        if ((clientY - popupHeight - 20) < 5) {
          _top = clientY - 80;
          PongPopupEven.removeClass("bottom-prong").addClass("top-prong");
        } else {
          _top = clientY- popupHeight - 110;
          PongPopupEven.removeClass("top-prong").addClass("bottom-prong");
        }

        SchedulePopup.css({"visibility": "visible", "left": _left, "top": _top});

        $("body").on("click", function (e) {
          if($(".fc-more-popover").length == 1){
            localStorage.setItem("flag", true);
          }
          if($(".fc-more-popover").length == 0 && localStorage.getItem("view_type") == "month" && localStorage.getItem("flag") != null){
            localStorage.removeItem("flag");
          }

          if($(".fc-popover").length == 1){
            $(".fc-icon-x").click(function(){
              element.popover("hide");
            });
          }
        });
        $(".datepicker").click(function(){
          $(".popover").hide();
        });
      }
    },

    dayClick: function(date, jsEvent, view) {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      popupWidth = EventPopup.width();
      popupHeight = EventPopup.height();
      clientX = jsEvent.clientX;
      clientY = jsEvent.clientY;
      selectedElementHeight = $(jsEvent.toElement.parentElement).height();
      _left = 0;

      if ((clientX + popupWidth * 1/2 + 30) > windowWidth) {
        _left = windowWidth - popupWidth - 5;
        _leftPong = clientX + popupWidth - windowWidth;
        PongPopup.css({"left": _leftPong});
      } else {
        _left = clientX - popupWidth * 1/2;
        PongPopup.css({"left": 182});
      }

      if ((clientY - popupHeight) <= 15) {
        _top = clientY - 70;
        PongPopup.removeClass("bottom-prong").addClass("top-prong");
      } else {
        _top = clientY - popupHeight - 90;
        PongPopup.removeClass("top-prong").addClass("bottom-prong");
      }

      $("#search-setting").hide();
      $("#room_selector, #other_dropdown").removeClass("open");

      if((view.type == "month") && ((date.format() >= (new Date()).toISOString().slice(0, 10)) || (date._d >= (new Date())))) {
        // $("#modal-form").modal("show");
        EventPopup.css({"visibility": "visible", "left": _left, "top": _top});

        var TimeZoned = new Date(date.toDate().setTime(date.toDate().getTime() + (date.toDate().getTimezoneOffset() * 60000)));

        schedule_start_time.value(TimeZoned);
        schedule_finish_time.value(TimeZoned);

        schedule_start_time.max(schedule_finish_time.value());
        schedule_finish_time.min(schedule_start_time.value());
      }
    },
    viewRender: function(view, element) {
      EventPopup.css({"visibility": "hidden"});
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

  $("#modal-form").on("hidden.bs.modal", function(){
    $(this).find("form")[0].reset();
    $(".select-members").select2("val", "");
    $("#error_explanation").remove();
    MyCalendar.fullCalendar("unselect");
  });

  $("#modal-form").on("show.bs.modal", function(){
    $(".popover").hide();
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
    SchedulePopup.css({"visibility": "hidden"});
  });

  $(".fc-next-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
    SchedulePopup.css({"visibility": "hidden"});
  });

  $(".fc-today-button").click(function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
    SchedulePopup.css({"visibility": "hidden"});
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

  $(".bubbleclose").bind("click", function(){
    EventPopup.css({"visibility": "hidden"});
    MyCalendar.fullCalendar("unselect");
  });
});
