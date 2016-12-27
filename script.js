//const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
// const events = 
// [ { start: 215, end: 378 },
//   { start: 600, end: 687 },
//   { start: 590, end: 600 },
//   { start: 559, end: 632 },
//   { start: 54, end: 677 } ];

const containerHeight = 720;
const containerWidth = 600;
const minutesinDay = 60 * 12;
let width = [];
let offset = [];
let columns = 1;

// append one event to calendar
var createEvent = (height, top, left, units) => {

  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML = 
  "<span class='title'> Sample Item </span> \
  <br><span class='location'> Sample Location </span>";

  // Customized CSS to position each event
  node.style.width = (containerWidth/columns) * units + "px";
  node.style.height = height + "px";
  node.style.top = top + "px";
  node.style.left = 100 + 10 + left + "px";

  document.getElementById("events").appendChild(node);
}

// this function lays out the events which are overlapping in a range. 
// it is used to get the width of an event
function getCollisions (events) {

  //resets variable
  width = [];
  offset = [];

  let visited = [];

  // check each event against what has been visited
  for (var i = 0; i < events.length; i++) {
    //first event
    var event = events[i];
    var overlap = false;

    if (visited.length === 0) {
      visited.push(event);
      width.push(1);
      offset.push(1)
      continue;
    }
    // check event against all events previously visited
    // if conflict, increment columns
    // for all not in conflict, match column in width
    // 
    for (var j = 0; j < visited.length; j++) {
      var visit = visited[j];

      if (event.end > visit.start && event.end < visit.end || 
          event.start > visit.start && event.start < visit.end ||
          event.start > visit.start && event.end < visit.end ||
          visit.start > event.start && visit.end < event.end) {     
        columns ++
        width.push(1);
        offset.push(columns);
        overlap = !overlap;
        break;
      } 
    }

    if (!overlap) {
      width.push(1);
      offset.push(1);
    }

    visited.push(event);
  }
  console.log(visited, columns, width, offset);
} 
//test
console.log(getCollisions(events));


var layOutDay = (events) => {

  getCollisions(events);

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let units = width[id];
    let left = (containerWidth / columns) * (offset[id] - 1) ;
    createEvent(height, top, left, units);
  });
}