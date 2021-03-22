// just some console.logging at the start to make
// sure the script runs and we have data (from dataManager.js)
console.log("\n\n\nWelcome!\n\n\n");
console.log("script runs.");
console.log("do we have data?");
// check if variable exists: https://stackoverflow.com/a/519157
console.log("data:", typeof data!=='undefined'?data:"nothing here");
console.log(typeof data!=='undefined'?"seems like it ;-) it comes from the dataManager.js script.":"...damnit! let's see what is going wrong in the dataManager.js script.");

const viz = d3.select("#container").append("svg").attr("id", "#viz").attr("width", 800).attr("height", 600);
let axisG = viz.append("g").attr("transform", "translate(0, 550)");


function updateData() {
  switch(this.id) {
    case "buttonA":
      addDatapoints(Math.round(Math.random() * 6));
      break;
    case "buttonB":
      removeDatapoints(Math.round(Math.random() * data.length));
      break;
    case "buttonC":
      removeAndAddDatapoints(Math.round(Math.random() * 6), Math.round(Math.random() * data.length / 2));
      break;
    case "buttonD":
      sortDatapoints();
      break;
    case "buttonE":
      shuffleDatapoints();
      break;
    case "buttonF":
      changeData();
  }
  drawViz();
}

drawViz();

let buttons = document.getElementById("buttons").querySelectorAll(".button");
console.log(buttons);
buttons.forEach(button => button.addEventListener("click", updateData));


function drawViz() {
  console.log(data.map(d => d.name));
  let emojiScale = d3.scaleBand().domain(data.map(d => d.name)).range([0,800]).paddingInner(0.1).paddingOuter(0.12).align(0.5);
  let emojiAxis = d3.axisBottom(emojiScale);
  let lengthScale = d3.scaleLinear().domain(d3.extent(data, d => d.value)).range([40, 500]);
  let easeFunc = d3.easeExpInOut;

  let barG = viz.selectAll(".bars").data(data, d => d.key);
  let exitingElements = barG.exit();
  exitingElements.transition().duration(500).delay((d,i) => i * 20).select("rect").attr("fill", "lightblue");
  exitingElements.transition().duration(2000).ease(easeFunc).attr("transform", "translate(-200, 0)").remove();
  axisG.transition().ease(easeFunc).duration(1000).call(emojiAxis).attr("font-size", 20);
  let enteringElements = barG.enter().append("g").attr("class", "bars");
  enteringElements.append("rect").transition().attr("width", emojiScale.bandwidth()).attr("height", d => lengthScale(d.value)).attr("fill", "red");
  enteringElements.attr("transform", d => `translate(1000, 0)`).transition().ease(easeFunc).duration(1000).delay((d,i) => i * 20).attr("transform", d => `translate(${emojiScale(d.name)}, ${550-lengthScale(d.value)})`);

  barG.transition().duration(500).delay((d,i) => i * 20).attr("transform", d => `translate(${emojiScale(d.name)}, ${550-lengthScale(d.value)})`);
  barG.select("rect").transition().duration(500).delay((d,i) => i * 20).attr("width", emojiScale.bandwidth()).attr("height", d => lengthScale(d.value)).attr("fill", "green");


}
