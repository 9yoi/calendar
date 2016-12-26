const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
const containerHeight = 720;
const containerWidth = 600;
const minutesinDay = 60 * 12;
let collisions = [];
let width = [];
let leftOffSet = [];

// append one event to calendar
var createEvent = (height, top, left, units) => {

  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML = 
  "<span class='title'> Sample Item </span> \
  <br><span class='location'> Sample Location </span>";

  // Customized CSS to position each event
  node.style.width = (containerWidth/units) + "px";
  node.style.height = height + "px";
  node.style.top = top + "px";
  node.style.left = 100 + left + "px";

  document.getElementById("events").appendChild(node);
}

/* 
collisions is an array that tells you which events are in each 30 min slot
- each first level of array corresponds to a 30 minute slot on the calendar 
  - [[0 - 30mins], [ 30 - 60mins], ...]
- next level of array tells you which event is present in that slot and the horizontal order
  - [[0,0,0,0], [0,0,1,2] ==> nothing at 9am, event 3 at order 1, event 4 at order 2
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
    let order = 1;

    while (start < end) {
      timeIndex = Math.floor(start/30);

      while (order < events.length) {
        if (collisions[timeIndex].indexOf(order) === -1) {
          break;
        }
        order ++;
      }

      collisions[timeIndex][id] = order;

      start = start + 30;
    }

    collisions[Math.floor((end-1)/30)][id] = order;

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
    leftOffSet.push(0);
  }

  collisions.forEach((period) => {

    // number of events in that period
    let count = period.reduce((a,b) => {
      return b ? a + 1 : a;
    })

    if (count > 1) {
      period.forEach((event, id) => {
        // max number of events it is sharing a time period with determines width
        if (period[id]) {
          if (count > width[id]) {
            width[id] = count;
          }
        }

        if (period[id] && !leftOffSet[id]) {
          leftOffSet[id] = period[id];
        }

        console.log(leftOffSet);
      })
    }

  });
  
  console.log(width, 'width');
  console.log(leftOffSet, 'leftOffSet');

  // for each event, pick a position for that range. 
  // pick 1 by default if 1 is empty.
  events.forEach((event) => {

  });


})();

var layOutDay = () => {

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let units = width[id];
    if (!units) {units = 1};
    console.log(containerWidth, id, width[id], leftOffSet[id])
    let left = (containerWidth / width[id]) * (leftOffSet[id] - 1) + 10;
    if (!left || left < 0) {left = 10};
    console.log(id, left, 'id, left');

    // go through collisions. 
    // Save the largest number of collisions found in event's time period and use that to determine width
    createEvent(height, top, left, units);
  });
}


