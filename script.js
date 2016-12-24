const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
const containerHeight = 720;
const minutesinDay = 60 * 12;

var createEvent = (height, top) => {

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
  node.style.position = "absolute"

  // Customized CSS
  node.style.width = "50%";
  node.style.top = height + "px";

  document.getElementById("days").appendChild(node);
}

var layOutDay = () => {
  events.forEach((event) => {

    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight

    createEvent(height);

  });
}

