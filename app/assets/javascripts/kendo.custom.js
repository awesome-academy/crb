$(document).ready(function() {
  var now_in_milisec = (new Date()).getTime();
  var hour = (new Date()).getHours();
  var minute = (new Date()).getMinutes();
  var second = (new Date()).getSeconds();
  var interval = 15;
  var interval_in_milisec = interval * 60 * 1000;
  var min_in_milisec = (parseInt(now_in_milisec / interval_in_milisec) + 1) * interval_in_milisec;
  var tenPM = new Date(now_in_milisec - (hour * 60 * 60 + minute * 60 + second) * 1000 + 22*3600*1000);

  var startChange = function startChange() {
    var startDate = schedule_start_time.value();
    var endDate = schedule_finish_time.value();

    if (startDate) {
      startDate = new Date(startDate);
      startDate.setDate(startDate.getDate());
      schedule_finish_time.min(startDate);
    } else if (endDate) {
      schedule_start_time.max(new Date(endDate));
    } else {
      endDate = new Date();
      schedule_start_time.max(endDate);
      schedule_finish_time.min(endDate);
    }
  }

  var endChange = function endChange() {
    var endDate = schedule_finish_time.value();
    var startDate = schedule_start_time.value();

    if (endDate) {
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate());
      schedule_start_time.max(endDate);
    } else if (startDate) {
      schedule_finish_time.min(new Date(startDate));
    } else {
      endDate = new Date();
      schedule_start_time.max(endDate);
      schedule_finish_time.min(endDate);
    }
  }

  schedule_start_time = $("#schedule_start_time").kendoDateTimePicker({
    min: new Date(min_in_milisec),
    interval: interval,
    change: startChange,
    parseFormats: ["MM/dd/yyyy"],
    format: "yyyy-MM-dd HH:mm",
    timeFormat: "HH:mm",
    animation: {
      close: {
        effects: "fadeOut",
        duration: 300
      },
      open: {
        effects: "fadeIn",
        duration: 300
      }
    },
    open: function() {
      $(".k-weekend a").bind("click", function() {
        return false;
      });
    },
  }).data("kendoDateTimePicker");

  var start_timepicker = $("#schedule_start_time").data("kendoDateTimePicker");
  start_timepicker.setOptions({
    max: new Date(tenPM)
  });

  schedule_finish_time = $("#schedule_finish_time").kendoDateTimePicker({
    min: new Date(min_in_milisec + interval_in_milisec),
    interval: interval,
    change: endChange,
    parseFormats: ["MM/dd/yyyy"],
    format: "yyyy-MM-dd HH:mm",
    timeFormat: "HH:mm",
    animation: {
      close: {
        effects: "fadeOut",
        duration: 300
      },
      open: {
        effects: "fadeIn",
        duration: 300
      }
    },
    open: function() {
      $(".k-weekend a").bind("click", function() {
        return false;
      });
    },
  }).data("kendoDateTimePicker");

  var finish_timepicker = $("#schedule_finish_time").data("kendoDateTimePicker");
  finish_timepicker.setOptions({
    max: new Date(tenPM)
  });

  schedule_start_time.max(schedule_finish_time.value());
  schedule_finish_time.min(schedule_start_time.value());

  $("#schedule_start_time").attr("readonly", "readonly");
  $("#schedule_finish_time").attr("readonly", "readonly");

});
