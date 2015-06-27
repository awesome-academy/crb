$(document).ready(function(){
  $("body").on("click", function (e) {
    if($(".fc-more-popover").length == 1){
      localStorage.setItem("flag", true);
    }

    if($(".fc-more-popover").length == 0 && localStorage.getItem("view_type") == "month" && localStorage.getItem("flag") != null){
      localStorage.removeItem("flag");
      $(".popover").hide();
    }

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

  $("#modal-form").on("show.bs.modal", function(){
    $(".popover").hide();
  });
});
