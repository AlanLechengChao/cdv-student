let viz = d3.select("#d3focus")
                .attr("width", 800)
                .attr("height", 600)
                .style("background-color", "lightgrey")
                .style("margin", "auto");


d3.json("data.json").then(rawData => {
  console.log(rawData);
  viz.selectAll("line").data(rawData)
  .enter().append("line")
    .attr("x1", (d,i) => 50 + i * viz.attr("width")/rawData.length)
    .attr("x2", (d,i) => 50 + i * viz.attr("width")/rawData.length)
    .attr("y1", 100)
    .attr("y2", d => d.distance/16 * (viz.attr("height") - 100) + 100)
    .attr("stroke", "black")
    .attr("stroke-width", d => 1.7 ** d.speed)
    .attr("stroke-dasharray", d => d.hand == "right" ? 10 : "none");
  viz.selectAll("polygon").data(rawData)
  .enter().append("polygon")
    .attr("class", "triangle")
    .attr("points", (d,i) => `${36 + i * viz.attr("width")/rawData.length},100 ${40 + i * viz.attr("width")/rawData.length},100 ${40 + i * viz.attr("width")/rawData.length},${d.turns*3 + 100}`)
  let start = viz.selectAll("circle").data(rawData)
  .enter().append("circle")
    .attr("cx", (d,i) => 45 + i * viz.attr("width")/rawData.length)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", d => d.startingComplexity * 3);
  start.enter().data(rawData)
    .enter().append("circle")
      .attr("cx", (d,i) => 45 + i * viz.attr("width")/rawData.length)
      .attr("cy", d => d.distance/16 * (viz.attr("height") - 100) + 120)
      .attr("r", 20)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", d => d.endingComplexity * 3);
});
