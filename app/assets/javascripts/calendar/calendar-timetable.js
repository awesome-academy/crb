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

      // the element that wraps the time-grid that will probably scroll
      this.scrollerEl = this.el.find(".timetable");
    },
    renderEvents: function(events) {
      this.el.html(this.renderHtml(events));
      this.scrollerEl = this.el.find(".timetable");
      this.updateHeight();
    },
    renderHtml: function(events) {
      current_user_id = $("body").data("current-user-id");
      events = _.sortBy(events, "start");

      var schedule_days = _.groupBy(events, function(schedule){return schedule.start.format("LL")});

      html = $(".header").html() + "<div class=\"timetable\"><table class=\"listv\" cellspacing=\"0\"><tbody>";

      $.each(schedule_days, function (_day, index) {
        schedules_group_by_day = schedule_days[_day];

        for(i = 0; i < schedules_group_by_day.length; i++) {
          schedule = schedules_group_by_day[i];

          html += "<tr class=\"lv-row\">";

          if(i === 0) {
            html += "<th class=\"lv-datecell\" rowspan=" + schedules_group_by_day.length + ">";
            html += _day;
            html += "</th>";
          }

          _class =  (i === schedules_group_by_day.length) ? "last " : "";
          _class += "event-" + schedule.id;

          html += "<td class=\"lv-eventcell lv-time " + _class + "\"" + ">";
           html += schedule.start.format("HH : mm") + " - " + schedule.end.format("HH : mm");
          html += "</td>";

          html += "<td class=\"lv-eventcell lv-title " + _class + "\"" +">";
            html += "<div class=\"s-title\"><a href=\"javascript:void(0)\"><span data-event-id=" + schedule.id + " class=\"plus\"><span class=\"glyphicon glyphicon-plus-sign icon\"></span>" + schedule.title + "</span></a></div>";

            html += "<div class=\"s-detail\" id=\"event-" + schedule.id + "\"" + ">";
              html += "<span class=\"s-description\">";
                html += schedule.description;
              html += "</span>";

              html += "<span class=\"s-actions\">";
                html += "<a title=\"Detail\" href=\"/schedules/" + schedule.id + "\"><span class=\"glyphicon glyphicon-share\" aria-hidden=\"true\"></span></a>&nbsp;"

                if(schedule.user_id === current_user_id) {
                  if(schedule.end > $.now()) {
                    html += "<a title=\"Edit\" href=\"/users/" + current_user_id + "/schedules/" + schedule.id + "/edit\"><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span></a>&nbsp;";
                  }
                  html += "<a data-confirm=\"Are you sure?\" title=\"Delete\" data-remote=\"true\" rel=\"nofollow\" data-method=\"delete\" href=\"/users/" + current_user_id + "/schedules/" + schedule.id + "\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></a></span>";
                }
              html += "</span>";
            html+="</div>";
          html += "</td></tr>";
        }
      });
      html += "</tbody></table></div>"

      return $("#time-table").innerHTML = html;
    },
    // Adjusts the vertical dimensions of the view to the specified values
    setHeight: function(totalHeight, isAuto) {
      var height = totalHeight - 22;
      this.scrollerEl.height(height).css("overflow-y", "scroll");
    }
  });

  FC.views.custom = TimeTableView; // register our class with the view system
});
