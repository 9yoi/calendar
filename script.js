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
let widths = [];
let columns = 1;
let offset = [];

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

  // get each container width and columns needed to fit all events
  collisions.forEach((event) => {
    widths.push(containerWidth / event.length)
    if (event.length > columns) {
      columns = event.length;
    }
  })

  return widths;
} 

// always slot item into column one. 
// if there is already something there, + width of the last item in conflict with
var findOffset = (events) => {

  let slotted = [];

  events.forEach((event, id) => {
    //first event
    if (slotted.length === 0) {
      slotted.push([event]);
    }

    // check event against whatever has been added to slotted
    for (var i = 0; i < slotted.length; i++) {
      let column = slotted[i];
      let conflict = false;
      // if collision within a slot, move to next slot by jumping out of inner loop
      for (var j = 0; j < column.length; j++) {
        let period = column[j];
        if(checkCollisions(event, period)) {
          conflict = !conflict;
          break;
        }
      }

      // if no collision for that slot, add event and terminate
      // event should be added for all columns according to width
      // e.g. if each column is 200px, a 400px event has to be added to 2 columns
      if (!conflict) {
        let width = widths[id];
        let column = i;
        offset[id] = containerWidth/columns * (i);
        while (width) {
          slotted[column] ? slotted[column].push(event) : slotted[column] = [event];
          width = width - containerWidth/columns;
          column ++; 
        }
        break;
      }
    }
  });

  return slotted;
    
}

var layOutDay = (events) => {

  getWidth(events);
  findOffset(events);

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let width = widths[id];
    let left = offset[id];
    console.log(event, height, top, left, width);
    createEvent(height, top, left, width);
  });
}

layOutDay(events);