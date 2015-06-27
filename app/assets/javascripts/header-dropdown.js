$(document).ready(function() {
  $("#h-dropdown").on("show.bs.dropdown", function () {
    $(".gb_v").show();
    $(".gb_vr").show();
    $(".gb_u").show();
  });

  $("#h-dropdown").on("hide.bs.dropdown", function () {
    $(".gb_v").hide();
    $(".gb_vr").hide();
    $(".gb_u").hide();
  });
});
