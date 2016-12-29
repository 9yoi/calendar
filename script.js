// init global variables

const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
// const events = 
// [ { start: 215, end: 378 },
//   { start: 600, end: 687 },
//   { start: 590, end: 600 },
//   { start: 559, end: 632 },
//   { start: 54, end: 677 } ];

const containerHeight = 720;
const containerWidth = 600;
const minutesinDay = 60 * 12;
const colSize = 10;
//const events = null;

let widths = [];
let offset = [];
let columns = [];


// helper function to append one event to DOM
var createEvent = (height, top, left, width) => {

  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML = 
  "<span class='title'> Sample Item </span> \
  <br><span class='location'> Sample Location </span>";

  // Customized CSS to position each event
  node.style.width = width + "px";
  node.style.height = height + "px";
  node.style.top = top + "px";
  node.style.left = 100 + 10 + left + "px";

  document.getElementById("events").appendChild(node);
}

// sort events by longest time period first. 
// this is used to slot events more effectively into the DOM later
var sortEvents = (events) => {
  events = events.sort((a, b) => {
   return (b.end - b.start) - (a.end - a.start);
  });
  console.log (events, 'sorted');
  return events;
}

/* helper function to find collisions
Visual of possible collision types                            
                                                                                         
                  ***                                           
        ***       * *                                           
    *** * *       * *                                           
    *** ***   *** * *                                           
    ***       *** * *                                           
    ***   ***     * *                                           
    ***   * *     * *                                           
          ***     * *                                           
                  ***  
*/

var checkCollisions = (event, otherEvent) => {
  if (event.start >= otherEvent.start && event.start <= otherEvent.end ||
        event.end >= otherEvent.start && event.end <= otherEvent.end ||
        event.start <= otherEvent.start && event.end >= otherEvent.end ||
        event.start >= otherEvent.start && event.end <= otherEvent.end) {
    return true;
  } 
  return false;
}

/*
Find out which events are in conflict with each other
Returns an array of array where 
- Index references eventId
- Numbers in array references the events it is in conflict with
e.g.[[1,2],[1,0]]
=> Event 0 has conflict with event 1 and 2 
=> Event 1 has conflict with Event 0 and 1

Initial width is container size / max number of conflicts

*/


var getWidth = events => {
  //reset
  widths = [];
  let collisions = [];
  // check each event against every other event
  events.forEach((event, id1) => {   
    collisions.push([]);

    events.forEach((otherEvent, id2) => {
      if (checkCollisions(event, otherEvent)) {
        collisions[id1].push(id2);
      }
    })
  })

  // get each container width and maxColumns needed to fit all events
  collisions.forEach((event) => {
    widths.push(containerWidth / event.length)
  })
  console.log(collisions, 'collisions');
  console.log(widths, 'widths');
  return widths;
} 

// helper function to add item to columns in findOffset
// event would be added to all columns according to width
// e.g. if each slot is 200px, a 400px event has to be added to 2 columns

var addToCol = (eventId, start) => {
  let unitWidth = colSize;
  let remainingWidth = widths[eventId];
  let col = start;
  while (remainingWidth) {
    columns[col] ? columns[col].push(eventId) : columns[col] = [eventId];
    remainingWidth = remainingWidth - unitWidth;
    col ++;
  }
  return columns;
};

// always slot item into column one. 
// if there is already something there, move to next column
var findOffset = (events) => {

  //reset
  columns = [];
  //first event
  if (columns.length === 0) {
    addToCol(0, 0);
    offset[0] = 0;
    while (columns.length < 60) {
      columns.push([]);
    }
  }

  events.forEach((event, id) => {
    // remaining events
    if (id > 0) {
      let conflict = false;
      // check event against whatever has been added to columns
      for (var i = 0; i < columns.length; i++) {
        conflict = false;
        // if collision within a column, move to next column by jumping out of inner loop
        for (var j = 0; j < columns[i].length; j++) {
          let period = columns[i][j];
          //!!!!!!!! reeval how to check collisions
          if(checkCollisions(event, events[period])) {
            conflict = !conflict;
            break;
          }
        }

        // if no collision for that column, add event and terminate
        if (!conflict) {
          //console.log(columns, id, i, 'no conflict new columns')
          offset[id] = i * colSize;
          addToCol(id, i);
          break;
        }
      }
    }

  });
  console.log(offset, 'offset');
  return offset;
}

// expand element to fit a given space
var expand = (events) => {
  events.forEach((event, id) => {
    for (var i = 0; i < columns.length - 1; i++) {
      // if event is present in current column and not in the next column
      // check if possible to add into next column (no collision)
      if (columns[i][id] && !columns[i+1][id]) {

        let colCollision = true;

        columns[i+1].forEach((period) => {
          console.log(event, events[period])
          if (!checkCollisions(event, events[period])) {
            colCollision = false;
          }
        });

        if (!colCollision) {
         // console.log(id, i, columns);
          columns[i+1].push(id);
          widths[id] = widths[id] + colSize;
        }
      }
    }
  })
}

var layOutDay = (events) => {

  // clear any existing nodes
  var myNode = document.getElementById("events");
  myNode.innerHTML = '';

  console.log(JSON.stringify(events), 'events received');
  sortEvents(events);
  getWidth(events);
  findOffset(events);
  expand(events);

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let width = widths[id];
    let left = offset[id];
    createEvent(height, top, left, width);
  });
}

layOutDay(events);