let viz = d3.select("#d3focus")
    .attr("width", "700px")
    .attr("height", "500px");
const marginX = 20;
const marginY = 40;
const tanG = 1.5;

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
    // console.log(x,y);
    return `translate(${x}, ${y})`
  })
  groups.append("circle")
    .attr("class", "starting")
    .attr("r", 18)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", d => d.startingComplexity * 3);
  groups.append("polyline")
    .attr("class","lefthand")
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("stroke-width", d => 1.7 ** d.speed)
    .attr("stroke-dasharray", d => d.hand == "left" ? 10 : "none")
    .attr("points", d =>{
      let lineLength = d.distance * 20;
      let turns = d.turns;
      if (turns == 0){
        return `0,18 0,${lineLength}`
      }
      else{
        let gap = lineLength / (turns + 1);
        let outputStr = "0,18 ";
        for (let i = 0; i < turns; i++) {
          let wide = gap * tanG;
          if (i % 2 == 0) {
            outputStr += `${-wide},${18+gap*i} `;
          }else{
            outputStr += `${wide},${18+gap*i} `;
          }
        }
        outputStr += `0,${lineLength}`;
        console.log(outputStr);
        return outputStr;
      }

    });
    groups.append("circle")
      .attr("class", "starting")
      .attr("r", 18)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("cy", d => d.distance * 20 + 18)
      .attr("stroke-width", d => d.endingComplexity * 3);

})
