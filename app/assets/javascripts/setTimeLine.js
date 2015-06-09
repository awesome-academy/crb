function setTimeLine() {
  var height, height_ratio, hour, left, now, timeline, top, width;

  if ($('.timeline').length === 0) {
    timeline = $('<hr>').addClass('timeline');
    $('.fc-time-grid-container').prepend(timeline);
  } else {
    timeline = $('.timeline');
  }

  now = moment();
  hour = now.hours();

  if ($('.fc-today').length === 0 || hour < 7 || hour > 22) {
    timeline.hide();
  } else {
    height = $('.fc-today').height();
    height_ratio = ((hour - 7) * 3600 + now.minutes() * 60 + now.seconds()) / (22 - 7) / 3600;
    width = $('.fc-today').outerWidth();
    left = $('.fc-today').position().left;
    top = height_ratio * height;

    timeline.css({
      'width': width + 'px',
      'left': left + 'px',
      'top': top + 'px'
    });

    timeline.show();
  }
}
