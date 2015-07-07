$(document).ready(function() {
  setTimeout(function() {
    $(".hide-flash").fadeOut("normal");
  }, 3000);
});

$(document).on("click", ".plus", function() {
  var _span = $(this).parent().find("span.glyphicon:first");
  var _eventId = $(this).data("event-id");

  if(_span.attr("class").indexOf("glyphicon-plus-sign") > 0) {
    _span.attr("class", "icon glyphicon glyphicon-minus-sign");
  } else {
    _span.attr("class", "icon glyphicon glyphicon-plus-sign");
  }

  $("#event-" + _eventId).slideToggle();
});

$(document).on("click", ".expand, .coll", function(e) {
  var icon = $(".plus").parent().find("span.glyphicon:first");
  var detail = $(".s-detail");

  if (e.currentTarget.className === "expand") {
    icon.removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
    detail.slideDown();
  } else {
    icon.removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
    detail.slideUp();
  }
});
