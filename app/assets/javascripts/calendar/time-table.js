$(document).ready(function() {
  $('.plus').click(function(){
    $("#event-" + $(this).data("event-id")).slideToggle();
  });

  $('.expand').click(function(){
    $('.s-detail').slideDown();
  });

  $('.coll').click(function(){
    $('.s-detail').slideUp();
  });

  $('.s-detail').slideUp();
});
