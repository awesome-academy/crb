$(document).ready(function() {
  if (Notification.permission !== "granted")
    Notification.requestPermission();

  var dispatcher;
  var host = location.host;
  var origin = location.origin;
  var title, body, link;
  var addition = "\nClick for details";

  dispatcher = new WebSocketRails(host + "/websocket");

  dispatcher.bind("announced_upcoming", function(schedule_id) {
    title = "Event upcomming";
    message = "Event is upcoming.";
    body = message + addition;
    link = origin + "/schedules/" + schedule_id.toString();
    notifyMe(title, body, link);
  });

  dispatcher.bind("invited", function(schedule_id) {
    title = "Invitation";
    message = "You were invited to participate an event.";
    body = message + addition;
    link = origin + "/schedules/" + schedule_id.toString();
    notifyMe(title, body, link);
  });

  dispatcher.bind("removed", function(schedule_id) {
    title = "Removed";
    message = "You were removed from an event.";
    body = message + addition;
    link = origin + "/schedules/" + schedule_id.toString();
    notifyMe(title, body, link);
  });

  dispatcher.bind("announced_updated", function(schedule_id) {
    title = "Updated Event";
    message = "Event were updated.";
    body = message + addition;
    link = origin + "/schedules/" + schedule_id.toString();
    notifyMe(title, body, link);
  });

});

function notifyMe(title, body, link){
  if(! ("Notification" in window) ){
    alert("Desktop notifications not available in your browser!\nTry Chrome");
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  if (Notification.permission === "granted") {
    var option = {
      body:body,
      dir:"auto"
    }

    var notification = new Notification(title,option);

    notification.onclick = function () {
      notification.close();
      window.open(link);
    };

    setTimeout(function(){
      notification.close();
    },10000);
  }
}
