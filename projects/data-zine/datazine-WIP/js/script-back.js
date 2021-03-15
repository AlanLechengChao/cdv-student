const container = d3.select("#container");
const width = 1200;
const height = 800;
const marginX = 50;
const marginY = 200;
const tanG = 0.25;

const viz_back = container.append("svg")
                            .attr("id", "back")
                            .attr("width", width)
                            .attr("height", height);
const sampleData = [{
    "timestamp": "2021-02-28T09:40:04.000Z",
    "speed": 3,
    "distance": 1,
    "startingComplexity": 4,
    "endingComplexity": 1,
    "hand": "left",
    "turns": 3
}];
console.log(sampleData);
function makeShapes(object) {
  let totalLengthScaler = d3.scaleLinear()
    .domain([0, d3.max(sampleData, d => d.distance) + 3])
    .range([100, 1000]);
  console.log(object.node());
  const radius = 28;
  const paddingHeight = 20;
  const twin_line_padding = 10;
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
    .attr("stroke-dasharray", d => d.hand == "right" ? 5 : "none")
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
    .attr("stroke-dasharray", d => d.hand == "left" ? 10 : "none")
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
  return totalLengthScaler(object.data()[0].distance);
  // console.log(totalLengthScaler(object.data()[0].distance));
}

viz_back.append("text").text("4").attr("text-anchor", "middle").attr("x", width/2).attr("y", 30).attr("font-family", "Josefin Sans")
.attr("font-weight", 300).attr("font-size", 20);

viz_back.append("text")
  .text("legends")
  .attr("transform", "translate(80, 750)")
  .attr("font-family", "Josefin Sans")
  .attr("font-size", 56);
viz_back.append("text")
  .text("of how to read this abstract graph")
  .attr("transform", "translate(80, 775)")
  .attr("font-family", "Josefin Sans")
  .attr("font-weight", 200);
let sampleShape = viz_back.selectAll(".sampleShape")
                          .data(sampleData)
                          .enter()
                          .append("g")
                            .attr("class", "sampleShape")
                            .attr("transform", "translate(320,200)");
let length = makeShapes(sampleShape);
let legends = viz_back.append("g")
                        .attr("class", "legends")
                        .attr("transform", "translate(370,200)");
legends.append("line").attr("x1", -130).attr("x2", -130).attr("y1", 0).attr("y2", length/2 - 20).attr("stroke", "black");
legends.append("line").attr("x1", -130.5).attr("x2", -120).attr("y1", 0).attr("y2", 0).attr("stroke", "black");
legends.append("line").attr("x1", -130.5).attr("x2", -120).attr("y1", length).attr("y2", length).attr("stroke", "black");
legends.append("line").attr("x1", -130).attr("x2", -130).attr("y1", length/2 + 20).attr("y2", length).attr("stroke", "black");
legends.append("text")
          .text("distance")
          .attr("text-anchor", "middle")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 400)
          .attr("font-size", 22)
          .attr("y", `${length/2 + 5}`).attr("x", -130);
legends.append("line")
          .attr("class", "guidelines")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 200)
          .attr("y2", 0)
          .attr("stroke", "black");
legends.append("polyline")
          .attr("class", "guidelines")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points",`0,${length} 45,${length} 155, 0`);
legends.append("text")
          .text("starting complexity / ending complexity")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 400)
          .attr("font-size", 22)
          .attr("y", 5).attr("x", 206);
legends.append("text")
          .text("of how many bikes are there at the parking spot")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 200)
          .attr("font-size", 15)
          .attr("y", 22).attr("x", 206);
legends.append("circle")
          .attr("cx", 234)
          .attr("cy", 60)
          .attr("r", 28)
          .attr("fill", "none")
          .attr("stroke", "black");
legends.append("circle")
          .attr("cx", 558)
          .attr("cy", 60)
          .attr("r", 28)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 20);
legends.append("polyline")
          .attr("points", "234,102 234,110 558,110 558,102")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("strokeWidth", 0.7);
legends.append("text")
          .text("rare")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 300)
          .attr("text-anchor", "middle")
          .attr("x", 234).attr("y", 124)
          .attr("font-size", 16);
legends.append("text")
          .text("crowded")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 300)
          .attr("text-anchor", "middle")
          .attr("x", 558).attr("y", 124)
          .attr("font-size", 16);
legends.append("line")
          .attr("class", "guidelines")
          .attr("x1", 0)
          .attr("y1", length/2)
          .attr("x2", 200)
          .attr("y2", length/2)
          .attr("stroke", "black");
legends.append("polyline")
          .attr("points", `0,${length/2} 45,${length/2} 155,${length/2 + 100} 200,${length/2 + 100}`)
          .attr("class", "guidelines")
          .attr("stroke", "black")
          .attr("fill", "none");
legends.append("polyline")
          .attr("points", `0,${length/2} 45,${length/2} 155,${length/2 + 280} 200,${length/2 + 280}`)
          .attr("class", "guidelines")
          .attr("stroke", "black")
          .attr("fill", "none");
legends.append("text")
          .text("turns")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 400)
          .attr("font-size", 22)
          .attr("y", `${length/2 + 285}`).attr("x", 206);
legends.append("text")
          .text("how many turns I took / zig-zags")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 200)
          .attr("font-size", 15)
          .attr("y", 18 + length/2 + 285).attr("x", 206);
legends.append("text")
          .text("speed")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 400)
          .attr("font-size", 22)
          .attr("y", `${length/2 + 105}`).attr("x", 206);

legends.append("text")
          .text("faster! thicker!")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 200)
          .attr("font-size", 15)
          .attr("y", 22 + length/2 + 105).attr("x", 206);
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${234},${length/2 + 105 + 30} ${234},${length/2 + 105 + 30 + 60}`)
          .attr("stroke-width", 1.6);
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${558},${length/2 + 105 + 30} ${558},${length/2 + 105 + 30 + 60}`)
          .attr("stroke-width", 1.6**5);
legends.append("polyline")
          .attr("points", `234,${length/2 + 105 + 102} 234,${length/2 + 105 + 110} 558,${length/2 + 105 + 110} 558,${length/2 + 105 + 102}`)
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("strokeWidth", 0.7);
legends.append("text")
          .text("slow")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 300)
          .attr("text-anchor", "middle")
          .attr("x", 234).attr("y", 124 + length/2 + 108)
          .attr("font-size", 16);
legends.append("text")
          .text("fast")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 300)
          .attr("text-anchor", "middle")
          .attr("x", 558).attr("y", 124 + length/2 + 108)
          .attr("font-size", 16);

// hands illustration
legends.append("text")
          .text("hands")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 400)
          .attr("font-size", 22)
          .attr("y", `${length/2 + 5}`).attr("x", 206);
legends.append("text")
          .text("both hands / left hand / right hand")
          .attr("font-family", "Josefin Sans")
          .attr("font-weight", 200)
          .attr("font-size", 15)
          .attr("y", 22 + length/2).attr("x", 206);
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${206+20},${length/2 + 30} ${206+20},${length/2 + 30 + 36}`)
          .attr("stroke-width", "2");
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${206+30},${length/2 + 30} ${206+30},${length/2 + 30 + 36}`)
          .attr("stroke-width", "2");
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${75+206+20},${length/2 + 30} ${75+206+20},${length/2 + 30 + 36}`)
          .attr("stroke-width", "2");
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${75+206+30},${length/2 + 30} ${75+206+30},${length/2 + 30 + 36}`)
          .attr("stroke-width", "2")
          .attr("stroke-dasharray", 4);
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${150+206+20},${length/2 + 30} ${150+206+20},${length/2 + 30 + 36}`)
          .attr("stroke-width", "2")
          .attr("stroke-dasharray", 4);
legends.append("polyline")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("points", `${150+206+30},${length/2 + 30} ${150+206+30},${length/2 + 30 + 36}`)
          .attr("stroke-width", "2")
          ;
