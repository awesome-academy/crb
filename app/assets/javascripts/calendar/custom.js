$(document).ready(function() {
  $(window).trigger("resize");
  var schedule_query_url = "/api/schedules.json";
  var MyCalendar = $("#calendar");
  var MyMiniCalendar = $("#mini-calendar");

  var EventPopup = $("#quick-event-popup");
  var EventPreviewPopup = $("#event-preview-popup");
  var PongPopup = $("#prong");
  var EventTimeRange = $("#quick-event-popup .time-range");
  var EventPreviewTimeRange  = $("#event-preview-popup .time-range");
  var EventPreviewTitle = $("#event-preview-popup .event-title");
  var EventPreviewDetailLink = $("#event-preview-popup .eb-details-link");
  var EventNewForm = $("form#new_schedule");

  var lastSelectedDay;

  var clock = 5*60;

  var current_user_id = $("body").data("current-user-id");
  var view_type = localStorage.getItem("view_type");

  var schedule_start = $("#schedule_start_time");
  var schedule_finish = $("#schedule_finish_time");
  schedule_start.attr("readonly", "readonly");
  schedule_finish.attr("readonly", "readonly");

  var date, currentMonth, currentDate, currentHour, currentMinute, startMonth, startDate, startHour, startMinute;

  var windowWidth, popupWidth, popupHeight, clientX, clientY, _left, _top, _leftPong, selectedElementHeight;
  var moment;

  var getTime = function getTime(arg) {
   return new Date(arg.setTime(arg.getTime() + (arg.getTimezoneOffset() * 60000)));
  }

  $("#room_selector ul.dropdown-menu li").click(function(e) {
    var room_id = $(this).val();
    if (room_id === 0) {room_id = "";}

    room_name = $(this).find("span").text();
    schedule_query_url = "/api/schedules.json?room_id=" + room_id;
    MyCalendar.fullCalendar("refetchEvents");
    $("#room_dropdown").html(room_name);

    if (room_id !== "") {
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
    defaultView: view_type === "undefined" ? "month" : view_type,
    defaultDate: new Date(),
    editable: true,
    businessHours: {
      start: "7:45:00",
      end: "16:45:00",
    },
    eventLimit: true,
    weekends: false,
    height: $(window).height() - $("header").height() - 50,
    minTime: "07:00:00",
    maxTime: "22:00:00",
    allDaySlot: false,
    keepOpen: false,
    unselectAuto: false,
    selectable: {
      month: false,
      agenda: true
    },
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
              var color = end_time < time_now ? "#B4B4CD" : schedule.room_color;
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
      date = new Date();
      currentMonth = date.getMonth();
      currentDate = date.getDate();
      currentHour = date.getHours();
      currentMinute = date.getMinutes();
      startMonth = start.month();
      startDate = start.date();
      startHour = start.hour();
      startMinute = start.minute();

      if (end.date() === start.date() && (currentMonth < startMonth || (currentDate < startDate || (currentDate === startDate && (currentHour < startHour || (currentHour === startHour && currentMinute < startMinute)))))) {
        windowWidth = window.innerWidth;
        popupWidth = EventPopup.width();
        popupHeight = EventPopup.height();
        clientX = jsEvent.clientX;
        clientY = jsEvent.clientY;
        selectedElementHeight = $(jsEvent.toElement.parentElement).height();
        _left = 0;
        _top = -70 - jsEvent.offsetY;
        _leftPong = (popupWidth - PongPopup.width()) * 1/2;

        if ((clientX + popupWidth * 1/2 + 30) > windowWidth) {
          _left = windowWidth - popupWidth - 5;
          _leftPong = clientX + popupWidth - windowWidth;
        } else {
          _left = clientX - popupWidth * 1/2;
        }

        if ((clientY - popupHeight) < 15) {
          _top += clientY;
          PongPopup.removeClass("bottom-prong").addClass("top-prong");
        } else {
          _top += clientY - popupHeight - 20;
          PongPopup.removeClass("top-prong").addClass("bottom-prong");
        }

        schedule_start.val(start._d);
        schedule_finish.val(end._d);

        EventTimeRange.html(timeRange(start, end, false));
        PongPopup.css({"left": _leftPong});
        EventPopup.css({"visibility": "visible", "left": _left, "top": _top});
      } else {
        MyCalendar.fullCalendar("unselect");
        EventPopup.css({"visibility": "hidden"});
      }
    },
    eventClick: function(calEvent, jsEvent, view) {
      if (calEvent.id !== undefined) {
        EventPopup.css({"visibility": "hidden"});
        MyCalendar.fullCalendar("unselect");

        if (lastSelectedDay !== undefined) {
         lastSelectedDay.css("backgroundColor", "white");
        }

        var edit = "schedules/" + event.id + "/edit";
        var deleteRepeat = "repeats/" + event.repeat_id;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        popupWidth = EventPreviewPopup.width();
        popupHeight = EventPreviewPopup.height();
        clientX = jsEvent.clientX;
        clientY = jsEvent.clientY;
        selectedElementHeight = $(jsEvent.toElement.parentElement).height();
        _left = 0;
        _top = -70 - jsEvent.offsetY;
        _leftPong = (popupWidth - PongPopup.width()) * 1/2;

        if ((clientX + popupWidth * 1/2 + 30) > windowWidth) {
          _left = windowWidth - popupWidth - 5;
          _leftPong = clientX + popupWidth - windowWidth;
        } else {
          _left = clientX - popupWidth * 1/2;
        }

        if ((clientY - popupHeight) < 15) {
          _top += clientY;
          PongPopup.removeClass("bottom-prong").addClass("top-prong");
        } else {
          _top += clientY - popupHeight - 20;
          PongPopup.removeClass("top-prong").addClass("bottom-prong");
        }

        EventPreviewTimeRange.html(timeRange(calEvent.start, calEvent.end, false));
        EventPreviewTitle.html(calEvent.title);

        PongPopup.css({"left": _leftPong});
        EventPreviewPopup.css({"visibility": "visible", "left": _left, "top": _top});
      }
    },
    dayClick: function(date, jsEvent, view) {
      $(".popover").hide();
      $("#search-setting").hide();
      $("#room_selector, #other_dropdown").removeClass("open");

      EventPreviewPopup.css({"visibility": "hidden"});
      MyCalendar.fullCalendar("unselect");

      if (lastSelectedDay !== undefined) {
        lastSelectedDay.css("backgroundColor", "white");
      }

      date = new Date();

      if (view.type === "month" && (date._d >= _date)) {
        lastSelectedDay = $(this);

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        popupWidth = EventPopup.width();
        popupHeight = EventPopup.height();
        clientX = jsEvent.clientX;
        clientY = jsEvent.clientY;
        selectedElementHeight = $(this).height();
        _top = -90 - jsEvent.offsetY;
        _left = 0;
        _leftPong = (popupWidth - PongPopup.width()) * 1/2;

        if ((clientX + popupWidth * 1/2 + 30) > windowWidth) {
          _left = windowWidth - popupWidth - 5;
          _leftPong = clientX + popupWidth - windowWidth;
        } else {
          _left = clientX - popupWidth * 1/2;
        }

        PongPopup.css({"left": _leftPong});

        if ((clientY - popupHeight) < 15) {
          _top += clientY;
          PongPopup.removeClass("bottom-prong").addClass("top-prong");
        } else {
          _top += clientY - popupHeight;
          PongPopup.removeClass("top-prong").addClass("bottom-prong");
        }

        var start = new Date(date._d.setHours(7));
        start = new Date(start.setMinutes(0));

        var end = new Date(date._d.setHours(21));
        end = new Date(end.setMinutes(0));

        schedule_start.val(start);
        schedule_finish.val(end);

        $(this).css("background-color", "rgba(58, 135, 173, .7)");
        EventTimeRange.html(timeRange(date, date, true));
        EventPopup.css({"visibility": "visible", "left": _left, "top": _top});
      } else if (EventPopup.is(":visible")) {
        EventPopup.css({"visibility": "hidden"});
      }
    },
    viewRender: function(view, element) {
      EventPopup.css({"visibility": "hidden"});
      EventPreviewPopup.css({"visibility": "hidden"});

      localStorage.setItem("view_type", view.type);

      try {
        setTimeLine();
        setInterval(function(){ setTimeLine(); }, clock*1000);
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
    MyCalendar.fullCalendar("gotoDate", ev.date);
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

      if (end_time < time_now) { event.color = "#B4B4CD"; }
    });

    MyCalendar.fullCalendar("removeEvents");
    MyCalendar.fullCalendar("addEventSource", events);
    MyCalendar.fullCalendar("rerenderEvents");
  }, 900000);

  $(".bubbleclose").bind("click", function() {
    EventPopup.css({"visibility": "hidden"});
    EventPreviewPopup.css({"visibility": "hidden"});
    MyCalendar.fullCalendar("unselect");
    EventNewForm[0].reset();

    if (lastSelectedDay !== undefined) {
      lastSelectedDay.css("backgroundColor", "white");
    }
  });

  $(".fc-close").unbind("click", function() {
    EventPopup.css({"visibility": "hidden"});
    EventPreviewPopup.css({"visibility": "hidden"});
  });
});

function timeRange(startTime, endTime, dayClick) {
  if (dayClick) {
    return startTime.format("dddd DD-MM-YYYY");
  } else {
    return startTime.format("dddd") + " " + startTime.format("H:mm A") + " To " + endTime.format("H:mm A") + " " + startTime.format("DD-MM-YYYY");
  }
}
