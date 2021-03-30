d3.json("births.json").then(gotData);


let w = 900;
let h = 500;
let xpadding = 100;
let ypadding = 50;
let viz = d3.select("#container")
  .append("svg")
    .style("width", w)
    .style("height", h)
    .style("outline", "solid black")
;


function gotData(incomingData){
  // the following function is defined below
  // it allows for us to NOT WORRY about parsing
  // time strings and creating JS date objects
  // in the following script
  incomingData = fixJSDateObjects(incomingData);
  console.log(incomingData);


  // temporarily flatten data to get the minima/maxima:
  let flatData = d3.merge(incomingData)
  // we can use a  time scale because our data expresses
  // years in the form of JS date objects
  let xDomain = d3.extent(flatData, function(d){ return d.year });
  let xScale = d3.scaleTime().domain(xDomain).range([xpadding, w-xpadding]);
  let xAxis = d3.axisBottom(xScale);
  let xAxisGroup = viz.append("g")
      .attr("class", "xaxisgroup")
      .attr("transform", "translate(0,"+(h-ypadding)+")")
  ;
  xAxisGroup.call(xAxis);

  let yMax = d3.max(flatData, function(d){
    return d.birthsPerThousand;
  })
  let yDomain = [0, yMax];
  let yScale = d3.scaleLinear().domain(yDomain).range([h-ypadding, ypadding]);
  let yAxis = d3.axisLeft(yScale);
  let yAxisGroup = viz.append("g")
      .attr("class", "yaxisgroup")
      .attr("transform", "translate("+(xpadding/2)+",0)")
  ;
  yAxisGroup.call(yAxis);

  // binding the function to the china button
  document.getElementById("china").addEventListener("click", function(){
    // index the incomingData [[...], [...]], and wrap it with a new array
    drawLine([incomingData[1]], "red");
  });

  // binding the function to the usa button
  document.getElementById("usa").addEventListener("click", function(){
    // index the incomingData [[...], [...]], and wrap it with a new array
    drawLine([incomingData[0]], "blue");
  });
  
  let graphGroup = viz.append("g").attr("class", "graphGroup");
  // parameters: data => processed data; color: string literal
  function drawLine(data,color) {
    console.log(data[0][0].country,data);
    // the line shape function
    let lineMaker = d3.line().x(d => xScale(d.year)).y(d => yScale(d.birthsPerThousand)).curve(d3.curveCatmullRom.alpha(0.5));
    // binding data
    let line = graphGroup.selectAll(".line").data(data);
    let entered = line.enter();
    // easing function
    let easeFunc = d3.easeExpInOut;
    // first entry of button
    entered.append("path")
      .attr("class", "line")
      .attr("opacity", 0)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("d", lineMaker)
      .attr("stroke-width", 5)
      .transition().duration(1000).ease(easeFunc)
      .attr("opacity", 1);
    // update entry
    line
      .transition().duration(1000).ease(easeFunc)
      .attr("d", lineMaker)
      .attr("stroke", color);
  }
  

}

// function that turns all datapoints year values
// into JS date objects in the very beginning
// so that WE DON'T HAVE TO DEAL WITH IT LATER
function fixJSDateObjects(dataToFix){
  // timeParser
  let timeParse = d3.timeParse("%Y");
  return dataToFix.map(function(data){
    return data.map(function(d){
      return {
        "country": d.country,
        "year": timeParse(d.year),
        "birthsPerThousand": d.birthsPerThousand
      }
    })
  });
}
