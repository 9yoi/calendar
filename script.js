const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
const containerHeight = 720;
const minutesinDay = 60 * 12;
var collisions = [];

var createEvent = (height, top, width) => {

  // Default CSS that's the same for all
  let node = document.createElement("DIV");
  node.class = "event";
  node.style.backgroundColor = "pink";
  node.style.borderStyle = "solid";
  node.style.borderWidth = "1px";
  node.style.borderColor = "grey"
  node.innerHTML = 
  "<span class='event-title'> Sample Item </span> \
  <br><span class='event-location'> Sample Location </span>";

  // Customized CSS to position each event
  node.style.width = 100/width + "%";
  node.style.height = height + "px";
  node.style.position = "absolute";
  node.style.top = top + "px";

  document.getElementById("days").appendChild(node);
}

// get array that tells you how many events are in a certain time period
// each index corresponds to 30 minutes on the calendar

(function getCollisions () {

  for (var i = 0; i < 24; i ++) {
    collisions.push(0);
  }

  events.forEach((event) => {
    let end = event.end;
    let start = event.start;

    while (end > start) {
      collisions[Math.ceil(end/30) - 1] ++;
      end = end - 30;
    }
  });

})();

var layOutDay = () => {


  events.forEach((event) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let width = 1;

    while (end > start) {
      let index = Math.ceil(end/30) - 1;
      if (collisions[index] > width) {
        width = collisions[index];
      }
      end = end - 30;
    }
    createEvent(height, top, width);
  });
}

