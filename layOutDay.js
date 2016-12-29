//default events given
//const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
//const events = [ {start: 30, end: 150}, {start: 50, end: 600}, {start: 30, end: 620}, {start: 200, end: 670}, {start: 200, end: 670}, {start: 500, end: 600}];

//layOutDay(events);

//function to generate mock events for testing
function generateMockEvents (n) {
  let events = [];
  let minutesInDay = 60 * 12;

  while (n > 0) {
    let start = Math.floor(Math.random() * minutesInDay)
    let end = start + Math.floor(Math.random() * (minutesInDay - start));
    events.push({start: start, end: end})
    n --;
  }

  return events;
}