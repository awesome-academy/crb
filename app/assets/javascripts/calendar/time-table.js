$(function() {
  $(document).on("click",".plus", function(){
    class_name = $(this).parent().find("span.glyphicon:first").attr("class");
    if(class_name == "glyphicon glyphicon-plus-sign") {
      $(this).parent().find("span.glyphicon:first").attr("class","glyphicon glyphicon-minus-sign");
    } else {
      $(this).parent().find("span.glyphicon:first").attr("class","glyphicon glyphicon-plus-sign");
    }
    $("#event-" + $(this).data("event-id")).slideToggle();
  });

  $(document).on("click", ".expand", function() {
    $('.glyphicon').removeClass("glyphicon-plus-sign");
    $('.glyphicon').addClass("glyphicon-minus-sign");
    $(".s-detail").slideDown();
  });

  $(document).on("click", ".coll", function() {
    $('.glyphicon').addClass("glyphicon-plus-sign");
    $('.glyphicon').removeClass("glyphicon-minus-sign");
    $(".s-detail").slideUp();
  });
});
