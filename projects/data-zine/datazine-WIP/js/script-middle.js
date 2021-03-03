const tanG = 0.25;
const container = d3.select("#container");
const width = 1200;
const height = 800;
const marginX = 50;
const marginY = 200;
const viz_left = container.append("svg")
                            .attr("id", "left")
                            .attr("width", width)
                            .attr("height", height);
const viz_right = container.append("svg")
                            .attr("id", "right")
                            .attr("width", width)
                            .attr("height", height);

console.log(d3.selection);

d3.json("data.json").then(rawData => {
  let linearG = viz_left.selectAll(".linearG").data(rawData).enter()
    .append("g")
    .attr("class", "linearG");
  let totalLengthScaler = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.distance) + 3])
    .range([100, 1000]);
  let dataScale = d3.scaleTime().domain([new Date("2021-02-10"), new Date("2021-03-08")]).range([50, 300]);

  let axis = d3.axisLeft(totalLengthScaler);
  viz_left.append("g")
    .attr("transform", "translate(30,100) scale(0.7)")
    .call(axis);
  viz_left.append("text")
    .text("distance / km")
    .attr("transform", "translate(40, 140) scale(0.7) rotate(90)")
    .attr("font-family", "Josefin Sans")
    .attr("font-weight", 300);
  viz_left.append("text")
    .text("linear display of routes")
    .attr("transform", "translate(80, 750)")
    .attr("font-family", "Josefin Sans")
    .attr("font-size", 56);
  viz_left.append("text")
    .text("simple model without timestamp allocation")
    .attr("transform", "translate(80, 775)")
    .attr("font-family", "Josefin Sans")
    .attr("font-weight", 200);
  linearG.attr("transform", (d,i) =>{
    let width = viz_left.node().width.baseVal.value;
    let height = viz_left.node().height.baseVal.value;
    let date = new Date(d.timestamp);
    // let x = dataScale(date);
    let x = (i+1) * (width - 2 * marginX) / rawData.length + 30;
    // console.log(dataScale);
    let hrs = date.getHours();
    console.log(hrs);
    let y = 100;
    // let y = timeScale(hrs);
    // let y = ((parseInt(d.timestamp.slice(11, 13)) + 8 - 6) / 20) * (height - 2 * marginY);
    // console.log(x,y);
    return `translate(${x}, ${y})` + "scale(0.7)"
  })
  const radius = 28;
  const paddingHeight = 20;
  const twin_line_padding = 10;
  linearG.call(makeShapes);
  function makeShapes(object) {
    object.append("circle")
      .attr("class", "starting")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", d => d.startingComplexity * 4);
    object.append("circle")
        .attr("class", "ending")
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("cy", d => totalLengthScaler(d.distance))
        .attr("stroke-width", d => d.endingComplexity * 4);
    object.append("polyline")
      .attr("class","lefthand")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", d => 1.6 ** d.speed)
      .attr("stroke-dasharray", d => d.hand == "left" ? 5 : "none")
      .attr("points", d =>{
        let lineLength = totalLengthScaler(d.distance) - 2*paddingHeight - 2*radius;
        let turns = d.turns;
        if (turns == 0){
          return `${-twin_line_padding},${radius} ${-twin_line_padding},${lineLength + 2 * paddingHeight + radius}`
        }
        else{
          let gap = lineLength / (turns);
          let outputStr = `${-twin_line_padding},${radius} ${-twin_line_padding},${paddingHeight + radius} `;
          let currentY = paddingHeight + radius;
          for (let i = 0; i < turns; i++) {


            let wide = gap * tanG;
            if (i % 2 == 0) {
              if(i == 0){
                currentY += gap/2;
                outputStr += `${-wide-twin_line_padding},${currentY} `;
              }else{
                currentY += gap;
              outputStr += `${-wide-twin_line_padding},${currentY} `;
              }
            }else{
              currentY += gap;
              outputStr += `${wide - twin_line_padding},${currentY} `;
            }
          }
          outputStr += `${-twin_line_padding},${lineLength+paddingHeight+radius} ${-twin_line_padding},${lineLength+2*paddingHeight+radius}`;
          // console.log(outputStr);
          return outputStr;
        }
      });
    object.append("polyline")
      .attr("class","righthand")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", d => 1.6 ** d.speed)
      .attr("stroke-dasharray", d => d.hand == "right" ? 10 : "none")
      .attr("points", d =>{
          let lineLength = totalLengthScaler(d.distance) - 2*paddingHeight - 2*radius;
          let turns = d.turns;
          if (turns == 0){
            return `${twin_line_padding},${radius} ${twin_line_padding},${lineLength + 2*paddingHeight + radius}`
          }
          else{

            let gap = lineLength / turns;
            let outputStr = `${twin_line_padding},${radius} ${twin_line_padding},${paddingHeight + radius} `;
            let currentY = paddingHeight + radius;
            for (let i = 0; i < turns; i++) {
              let wide = gap * tanG;
              if (i % 2 == 0) {
                if(i == 0){
                  currentY += gap/2;
                  outputStr += `${-wide+twin_line_padding},${currentY} `;
                }else{
                  currentY += gap;
                outputStr += `${-wide+twin_line_padding},${currentY} `;
                }
              }else{
                currentY += gap;
                outputStr += `${wide+twin_line_padding},${currentY} `;
              }
            }
            outputStr += `${twin_line_padding},${lineLength+paddingHeight+radius} ${twin_line_padding},${lineLength+2*paddingHeight+radius}`;
            // console.log(outputStr);
            return outputStr;
          }
        });
    object.append("text")
      .attr("class", "time")
      .attr("y", d => totalLengthScaler(d.distance) + 60)
      .attr("font-family", "Josefin Sans")
      .attr("font-weight", 300)
      .text(d => {
          let date = new Date(d.timestamp);
          return `${date.getMonth()+1} / ${date.getDate()}`
      });
  }
  let timeScale = d3.scaleLinear().domain([0,24]).range([0, 360]);
  let circleG = viz_right.append("g").attr("class", "circleG").attr("transform", () => `translate(${viz_right.node().width.baseVal.value / 2},${viz_right.node().height.baseVal.value / 2})`);
  let middle_circle = circleG.append("circle")
                                .attr("r", 50)
                                .attr("fill", "none")
                                .attr("stroke", "black");
  let outer_circle = circleG.append("circle")
                                .attr("r", 300)
                                .attr("fill", "none")
                                .attr("stroke", "black");
  let radialG = viz_right.selectAll(".radialG").data(rawData).enter()
    .append("g")
    .attr("class", "radialG");
  radialG.attr("transform", (d) => {
    var date = new Date(d.timestamp);
    return `translate(${viz_right.node().width.baseVal.value / 2},${viz_right.node().height.baseVal.value / 2 + dataScale(date)})` + `rotate(${timeScale(date.getHours() + date.getMinutes()/60)}, 0, -${dataScale(date)})` + "scale(0.18)";
  })
  radialG.call(makeShapes);
  // makeShapes(radialG);
  viz_right.append("text")
    .text("radial display of routes")
    .attr("transform", "translate(80, 750)")
    .attr("font-family", "Josefin Sans")
    .attr("font-size", 56);
  viz_right.append("text")
    .text("model with timestamp allocation")
    .attr("transform", "translate(80, 775)")
    .attr("font-family", "Josefin Sans")
    .attr("font-weight", 200);
  console.log(timeScale.ticks(8).slice(0,-1));

  let radialAxis = g => {
    g.call(g => g.selectAll("g")
      .data(timeScale.ticks(8).slice(0,-1))
        .join("g")
          .attr("transform", d => `rotate(${timeScale(d)})`)
          .call(g => g.append("line").attr("y1", -50).attr("y2", -45).attr("stroke", "black"))
          .call(g => g.append("text").attr("text-anchor", "middle").attr("y", -40).text(d => d)).attr("font-size", 5)
    )
  }
  circleG.call(radialAxis);
});
