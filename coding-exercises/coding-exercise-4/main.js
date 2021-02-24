let viz = d3.select("#d3focus")
    .attr("width", "700px")
    .attr("height", "500px");
const marginX = 20;
const marginY = 40;

d3.json("data.json").then(rawData => {
  // console.log(rawData);
  let groups = viz.selectAll(".groups").data(rawData).enter()
    .append("g")
    .attr("class", "groups");
  groups.attr("transform", (d,i) =>{
    let width = viz.node().width.baseVal.value;
    let height = viz.node().height.baseVal.value;
    let x = (i+1) * (width - 2 * marginX) / rawData.length;
    let y = ((parseInt(d.timestamp.slice(11, 13)) + 8 - 6) / 18) * (height - 2 * marginY);
    console.log(x,y);
    return `translate(${x}, ${y})`
  })
  groups.append("circle")
    .attr("class", "starting")
    .attr("r", 18)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", d => d.startingComplexity * 3);
  groups.append
})
