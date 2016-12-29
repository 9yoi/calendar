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

// helper function to append one event to DOM
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

/*
Find out which events are in conflict with each other
Returns an array of array where 
- Index references eventId
- Numbers in array references the events it is in conflict with
e.g.[[1,2],[1,0]]
=> Event 0 has conflict with event 1 and 2 
=> Event 1 has conflict with Event 0 and 1

Initial width is container size / max number of conflicts

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

var getWidth = events => {

  let collisions = [];
  let width = [];
  // check each event against every other event
  events.forEach((event, id1) => {   
    collisions.push([]);

    events.forEach((otherEvent, id2) => {

      if (event.start >= otherEvent.start && event.start <= otherEvent.end ||
        event.end >= otherEvent.start && event.end <= otherEvent.end ||
        event.start <= otherEvent.start && event.end >= otherEvent.end ||
        event.start >= otherEvent.start && event.end <= otherEvent.end) {
        collisions[id1].push(id2);
      }
    })
  })

  collisions.forEach((event) => width.push(containerWidth / event.length))
  return width;
} 

// always slot item into position one. 
// if there is already something there, + width of the last item in conflict with
var findOffset  = () => {
  //reset offset
  let 
  offset = [];

}

var layOutDay = (events) => {

  let width = getWidth(events);

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

layOutDay(events);