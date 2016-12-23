const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];

const adjectives = ['Fun', 'Sad', 'Yummy', 'Atrocious', 'Hot', 'Boring', 'Exciting', 'Interesting']
const location = "Sample Location";

var generateEventName = function () {
  return `${ adjectives[Math.floor(Math.random())* (adjectives.length - 1)] } Event`
}

let layOutDay = function () {
  console.log(events);
}

