$(document).ready(function() {
  var free_rooms_query_url = "/api/rooms.json";
  var $submit_btn = $(".btn-submit");

  $(document).on("click", "#my_calendar .title, #shared_calendar .title", function(e) {
    changeState($(e.target.parentElement.children[1]));
  });

  $.get( "/api/shared_schedules", function(data) {
    $("#shared_schedules").html(data);
  });

  $.get( "/api/my_schedules", function(data) {
    $("#my_schedules").html(data);
  });

  function changeState(element) {
    var icon = element.parent().find("span.glyphicon:first");
    var isValid = element.attr("class") === "slide_down";

    element.attr("class", isValid ? "slide_up" : "slide_down");
    icon.attr("class", isValid ? "glyphicon glyphicon-chevron-right" : "glyphicon glyphicon-chevron-down");
    element.slideToggle();
  };

  function displayFreeRoom(except_room) {
    var start_time = $("#schedule_start_time").val();
    var finish_time = $("#schedule_finish_time").val();
    var $message_free_room = $(".free-room-message");
    var $available_room_block = $(".available-room-block");

    $message_free_room.hide();
    $available_room_block.css("display", "block");
    $submit_btn.attr("disabled", false);

    if (start_time && finish_time) {
      $.ajax({
        url: free_rooms_query_url,
        type: "GET",
        data: {start_time: start_time, finish_time: finish_time},
        success: function(response) {
          free_rooms = []
          $.each(response.free_rooms, function(index, room){free_rooms.push(room.id + "")})
          $(".room-choice input[type=radio]").each(function() {
            if(except_room != "" && except_room == $(this).val()) {
              $(this).parent().parent().css("display", "block");
              return;
            }
            if (free_rooms.indexOf($(this).val()) == -1) {
              $(this).prop("checked", false);
              $(this).parent().parent().css("display", "none");
            } else {
              $(this).parent().parent().css("display", "block");
            }
          });
          if (except_room == "" && free_rooms.length == 0) {
            $message_free_room.show();
            $available_room_block.css("display", "none");
            $submit_btn.attr("disabled", true);
          }
        }
      });
    }
  }

  function checkFreeRooms() {
    if($(".new_schedule").length > 0) {
      displayFreeRoom("");
    } else if ($(".edit_schedule").length > 0) {
      displayFreeRoom($("#room_id").val());
    }
  }

  $("#editLink").on("click", function() {
    start_time = $("#schedule_start_time").val();
    finish_time = $("#schedule_finish_time").val();
    title = $("#schedule_title").val();
    var json_data = JSON.stringify({start_time: start_time, finish_time: finish_time, title: title});
    var encrypt_data = btoa(json_data);
    window.location.href = "schedules/new?data="+ encrypt_data;
  });

  $("#load").click(function(){
    $(this).find("span").addClass("glyphicon glyphicon-refresh glyphicon-refresh-animate")
  });

  $("#schedule_start_time, #schedule_finish_time").on("change", function() {
    checkFreeRooms();
  });

  checkFreeRooms();
  $submit_btn.attr("disabled", true);
});
