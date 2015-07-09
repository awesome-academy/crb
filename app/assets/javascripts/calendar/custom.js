$(document).ready(function() {
  $(window).trigger("resize");
  var schedule_query_url = "/api/schedules.json";
  var MyCalendar = $("#calendar");
  var MyMiniCalendar = $("#mini-calendar");
  var EventPopup = $("#quick-event-popup");
  var EventPopupTitle = $("#quick-event-popup #schedule_title");
  var EventTimeRange = $("#quick-event-popup .time-range");
  var EventPreviewPopup = $("#event-preview-popup");
  var EventPreviewTimeRange  = $("#event-preview-popup .time-range");
  var EventPreviewTitle = $("#event-preview-popup .event-title");
  var EventPreviewDetailLink = $("#event-preview-popup .eb-details-link");
  var EventPreviewActionLink = $("#event-preview-popup .eb-action-link");
  var EventNewForm = $("form#new_schedule");

  var clock = 5*60;

  var current_user_id = $("body").data("current-user-id");
  var view_type = localStorage.getItem("view_type");

  var schedule_start = $("#schedule_start_time");
  var schedule_finish = $("#schedule_finish_time");
  schedule_start.attr("readonly", "readonly");
  schedule_finish.attr("readonly", "readonly");

  var date, currentMonth, currentDate, currentHour, startMonth, startDate, startHour, endDate;
  var windowWidth, popupWidth, popupHeight, clientX, clientY, _left, _top, _leftPong, selectedElementHeight;
  var events, moment, rect, offsetY, lastSelectedDay, ProngPopup, offsetLeft, offsetTop;

  $("#room_selector ul.dropdown-menu li").click(function() {
    var room_id = $(this).val();
    if (room_id === 0) {room_id = "";}

    var room_name = $(this).find("span").text();
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
    eventLimit: true,
    height: $(window).height() - $("header").height() - 50,
    minTime: "07:00:00",
    maxTime: "21:00:00",
    allDaySlot: false,
    keepOpen: false,
    unselectAuto: false,
    selectable: {
      month: false,
      agenda: true
    },
    selectHelper: true,
    timezone: "local",
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
    slotEventOverlap: false,
    eventResize: function(event, delta, revertFunc) {
      revertFunc();
    },
    eventDrop: function (event, dayta, revertFunc) {
      revertFunc();
    },
    select: function (start, end, jsEvent, view) {
      EventNewForm[0].reset();
      date = new Date();
      currentMonth = date.getMonth(); currentDate = date.getDate(); currentHour = date.getHours();
      currentMinute = date.getMinutes();
      startMonth = start.month(); startDate = start.date(); startHour = start.hour();
      startMinute = start.minute();
      endDate = end.date();

      if ((currentMonth < startMonth || (currentMonth === startMonth && (currentDate < startDate || (currentDate === startDate && currentHour < startHour) || (currentHour === startHour && currentMinute <= startMinute)))) && startDate === endDate) {
        showQuichCreateEventPopup(start, end, jsEvent, false);
      } else {
        MyCalendar.fullCalendar("unselect");
        EventPopup.css({"visibility": "hidden"});
      }

    },
    eventClick: function(calEvent, jsEvent, view) {
      EventNewForm[0].reset();

      if (calEvent.id !== undefined) {
        EventPopup.css({"visibility": "hidden"});
        MyCalendar.fullCalendar("unselect");
        setElementBackground(lastSelectedDay, "");
        showPreviewEventPopup(jsEvent, calEvent);
      }
    },
    dayClick: function(_date, jsEvent, view) {
      EventNewForm[0].reset();
      $("#search-setting").css({"visibility": "hidden"});
      $("#room_selector, #other_dropdown").removeClass("open");

      MyCalendar.fullCalendar("unselect");
      setElementBackground(lastSelectedDay, "");

      date = new Date();

      if (view.type === "month" && (_date._d > date || (_date._d.toDateString() === date.toDateString()))) {
        lastSelectedDay = $(this);
        $(this).css("background-color", "rgba(58, 135, 173, .3)");

        showQuichCreateEventPopup(_date, $.fullCalendar.moment(_date), jsEvent, true);
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
    eventAfterAllRender: function (view) {
      setElementBackground(lastSelectedDay, "");
      MyCalendar.find(".fc-left").append($("#room_selector"));
      MyCalendar.find(".fc-right").append($("#other_dropdown"));
    },
    loading: function(isLoading, view){
      $("label.loading").attr("class", isLoading ? "loading" : "loading hidden");
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
    $("body").trigger("click");
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
    events = MyCalendar.fullCalendar("clientEvents");
    date = new Date();

    $.each(events, function (index, event) {
      if (event.end._d < date) { event.color = "#B4B4CD"; }
    });

    MyCalendar.fullCalendar("removeEvents");
    MyCalendar.fullCalendar("addEventSource", events);
    MyCalendar.fullCalendar("rerenderEvents");
  }, 900000);

  $(document).on("click", ".fc-close, .fc-more, .dropdown-toggle, .bubbleclose", function() {
    MyCalendar.fullCalendar("unselect");

    EventPopup.css({"visibility": "hidden"});
    EventPreviewPopup.css({"visibility": "hidden"});
    EventNewForm[0].reset();

    setElementBackground(lastSelectedDay, "white");
  });

  $(".fc-prev-button, .fc-next-button, .fc-today-button").on("click", function() {
    moment = MyCalendar.fullCalendar("getDate");
    MyMiniCalendar.datepicker("update", moment._d);
  });

  function showQuichCreateEventPopup(start, end, jsEvent, dayClick) {
    ProngPopup = $("#prong");
    getCoodinates(jsEvent, EventPopup);
    EventPreviewPopup.css({"visibility": "hidden"});

    $("#error-messages").html("");

    if (dayClick) {
      start.local().set({hours: 7, minute: 0});
      end.local().set({hours: 21, minute: 0});
    }

    schedule_start.val(start._d);
    schedule_finish.val(end._d);

    EventTimeRange.html(timeRange(start, end, dayClick));
    EventPopup.css({"visibility": "visible", "left": _left, "top": _top});
    EventPopupTitle.focus();
  }

  function showPreviewEventPopup(jsEvent, calEvent) {
    ProngPopup = $("#prong-preview");
    getCoodinates(jsEvent, EventPreviewPopup);

    EventPreviewTimeRange.html(timeRange(calEvent.start, calEvent.end, false));
    EventPreviewTitle.html(calEvent.title);

    var eventPath = "schedules/" + calEvent.id;
    var editEventPath = eventPath + "/edit";

    if (calEvent.user_id === current_user_id) {
      var text, url;
      date = new Date();

      if (calEvent.end._d <= date) {
        text = "Detail event &raquo;"; url = eventPath;
      } else {
        text = "Edit event &raquo;"; url = editEventPath;
      }

      EventPreviewDetailLink.attr("href", url).html(text);
      EventPreviewActionLink.attr("href", eventPath).show();
    } else {
      EventPreviewActionLink.attr("href", "javascript:void(0)").hide();
      EventPreviewDetailLink.html("Detail event &raquo;").attr("href", eventPath);
    }

    EventPreviewPopup.css({"visibility": "visible", "left": _left, "top": _top});
  }

  function getCoodinates(jsEvent, target) {
    rect  = jsEvent.target.getBoundingClientRect();
    var slatsHeight = $(".fc-slats").height();
    var lastClick = slatsHeight < rect.height;

    windowWidth = window.innerWidth;
    popupWidth = target.width(); popupHeight = target.height();
    clientX = jsEvent.clientX; clientY = jsEvent.clientY;

    offsetLeft = (clientX + popupWidth * 1/2 + 30) > windowWidth;
    _leftPong = offsetLeft ? (clientX + popupWidth - windowWidth) : (popupWidth - ProngPopup.width()) * 1/2;
    _left = offsetLeft ? (windowWidth - popupWidth - 5) : (clientX - popupWidth * 1/2);

    if (lastClick) {
      offsetY = slatsHeight + rect.top;
      selectedElementHeight = $(".fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-helper").height();
      _top = offsetY - popupHeight - 90 - selectedElementHeight;
    } else {
      offsetY  = jsEvent.offsetY || (jsEvent.clientY - rect.top);
      offsetTop = (clientY - popupHeight) < 15;
      _top = clientY - (offsetTop ? 70 : (popupHeight + 90)) - offsetY;
    }

    ProngPopup.attr("class", offsetTop ? "top-prong" : "bottom-prong").css({"left": _leftPong});
  }

  function setElementBackground(element, bgColor) {
    if (element !== undefined) {
      element.css("backgroundColor", bgColor);
    }
  }

  function timeRange(startTime, endTime, dayClick) {
    if (dayClick) {
      return startTime.format("dddd DD-MM-YYYY");
    } else {
      return startTime.format("dddd") + " " + startTime.format("H:mm A") + " To " + endTime.format("H:mm A") + " " + startTime.format("DD-MM-YYYY");
    }
  }

  $(document).on("click", ".fc-body, #quick-event-popup", function(e){
    e.stopPropagation();
  });

  $(document).on("click", "body", function(e){
    EventPopup.css({"visibility": "hidden"});
    EventPreviewPopup.css({"visibility": "hidden"});
    setElementBackground(lastSelectedDay, "");
    MyCalendar.fullCalendar("unselect");
  });

  EventPopupTitle.click(function(){
    $("#error-messages").html("");
  });
});
