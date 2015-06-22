$(document).ready(function() {
  var FC = $.fullCalendar; // a reference to FullCalendar's root namespace
  var View = FC.View; // the class that all views must inherit from
  var TimeTableView; // our subclass

  TimeTableView = View.extend({ // make a subclass of View
    initialize: function() {
      // called once when the view is instantiated, when the user switches to the view.
      // initialize member variables or do other setup tasks.
      // this.coordMap = this.timeGrid.coordMap;
    },
    render: function() {
      // responsible for displaying the skeleton of the view within the already-defined
      // this.el, a jQuery element.
      this.el.html(this.renderHtml());
      // the element that wraps the time-grid that will probably scroll
      this.scrollerEl = this.el.find('.timetable');
    },
      // Builds the HTML skeleton for the view.
      // The day-grid component will render inside of a container defined by this HTML.
    renderHtml: function() {
      return $("#time-table").html();
    },
    // Adjusts the vertical dimensions of the view to the specified values
    setHeight: function(totalHeight, isAuto) {
      console.log(totalHeight);
      var height = totalHeight - 22;
      this.scrollerEl.height(height).css('overflow-y', 'scroll');
      // this.scrollerEl.height(scrollerHeight).css('overflow', 'hidden');
    }
  });

  FC.views.custom = TimeTableView; // register our class with the view system
});
