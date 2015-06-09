$(document).ready(function() {
  setTimeout(function() {
    $(".hide-flash").fadeOut("normal");
  }, 4000);

  $(".select-room").select2({
    width: 300
  });

  $(".select-members").select2({
    width: "100%"
  });
});
