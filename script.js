const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
const containerHeight = 720;
const containerWidth = 600;
const minutesinDay = 60 * 12;
let collisions = [];
let width = [];
let leftOffSet = [];

var createEvent = (height, top, left, units) => {

  // Default CSS that's the same for all
  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML = 
  "<span class='event-title'> Sample Item </span> \
  <br><span class='event-location'> Sample Location </span>";

  // Customized CSS to position each event
  node.style.width = 100/units - 1 + "%";
  node.style.height = height + "px";
  node.style.top = top + "px";
  node.style.left = 100 + left + "px";

  document.getElementById("events").appendChild(node);
}

/* 
collisions is an array that tells you which events are in each 30 min slot
each index of array corresponds to 30 minutes on the calendar
e.g.[[], [1], [1,2]] ==> nothing at 9am, event 1 at 9.30, event 1 and 2 at 10am
*/

(function getCollisions () {

  for (var i = 0; i < 24; i ++) {
    var time = [];
    for (var j = 0; j < events.length; j++) {
      time.push(0);
    }
    collisions.push(time);
  }

  events.forEach((event, id) => {
    let end = event.end;
    let start = event.start;

    while (start <= end) {
      timeIndex = Math.floor(start/30);
      collisions[timeIndex][id] = 1;
      start = start + 30;
    }

  });
  console.log(collisions);

})();

/*
find width and horizontal position

width 
- number of units to divide container width by
- for each period, set width to element/ length of array
- update as long as new width is smaller

horizontal position ==> pixel offset from left
- relates to index in array
*/
(function getAttributes () {

  for (var i = 0; i < events.length; i++) {
    width.push(0);
  }

  collisions.forEach((period) => {
    // number of events in that period
    let count = period.reduce((a,b) => {
      return a + b;
    })

    // for each event, get max number of events it is sharing a time period with
    if (count > 1) {
      period.forEach((event, id) => {
        if (period[id]) {
          if (count > width[id]) {
            width[id] = count;
          }
        }
      })
    }

  })
  console.log(width, "width");

})();

var layOutDay = () => {

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let units = width[id];
    if (!units) {units = 1};
    console.log(units, id, 'yo');
    //let left = containerWidth / leftOffSet[id];
    // go through collisions. 
    // Save the largest number of collisions found in event's time period and use that to determine width
    createEvent(height, top, 0, units);
  });
}


