const width = 1200;
const height = 600;
const xPadding = 50;
const yPadding = 50;


const viz = d3.select("#container").append("svg").attr("width", width).attr("height", height);
const legendBox = d3.select("#container").append("div");
const yearText = viz.append("text").text("").attr("transform", "translate(400,400)").attr("font-size", 60);
d3.csv("data.csv").then((rawData) => {
  let fertExtent = d3.extent(rawData, d => d.fert);
  let xScale = d3.scaleLinear().domain(fertExtent).range([xPadding, width-xPadding]);

  let lifeExtent = d3.extent(rawData, d => d.life);
  let yScale = d3.scaleLinear().domain(lifeExtent).range([height-yPadding, yPadding]);

  buildXAndYAxis(xScale, yScale);
  let popExtent = d3.extent(rawData, function(d, i){
    return d.pop;
  });

  let rScale = d3.scaleLinear().domain(popExtent).range([5, 50]);
  const years = rawData.reduce((acc, d) => {
    if (!acc.includes(parseInt(d.year))){
      acc.push(parseInt(d.year));
    }
    return acc
  }, []);

  const continents = rawData.reduce((acc, d) => {
    if (!acc.includes(d.continent)){
      acc.push(d.continent);
    }
    return acc
  }, []);

  let colorMap = d3.scaleOrdinal().domain(continents).range(["#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#264653"])
  let checkBoxs = legendBox.selectAll(".continent").data(continents).enter().append("div").attr("class", "continent");
  let status = checkBoxs.append("input").attr("type", "checkbox").attr("id", d => d);
  checkBoxs.append("div").attr("style", d => {
    return `width: 20px; height: 20px; display: inline-block; background-color: ${colorMap(d)}`
  });
  checkBoxs.append("span").text(d => d);

  let index = 0;
  setInterval(function(){
    // console.log(mappingStatus.Asia)
    let localData = rawData.filter(d => d.year == years[index] && document.getElementById(d.continent).checked);
    yearText.text(years[index]);
    index = (index + 1) % years.length;
    drawViz(localData);
  }, 300);


  function drawViz(comingData) {

    let datapoints = viz.selectAll(".datapoint").data(comingData, d => d.Country);
    // console.log(comingData);
    let enteringElements = datapoints.enter().append("g").attr("class", "datapoint");
    // console.log(enteringElements);


    datapoints.select("circle").transition().attr("r", d => {
      return rScale(d.pop)
    }).attr("fill", d => colorMap(d.continent));

    datapoints.transition().attr("transform", d => {return `translate(${xScale(d.fert)},${yScale(d.life)})`});
    enteringElements.append("circle").attr("opacity", 0.8).transition().attr("r", d => rScale(d.pop)).attr("fill", d => colorMap(d.continent));
    enteringElements.attr("transform", d => {return `translate(${xScale(d.fert)},${yScale(d.life)})`});
    enteringElements.append("text").text(d => d.Country).attr("fill", "black").attr("transform", "translate(5, 5)").attr("font-size", 12);
    let exitingElements = datapoints.exit();
    exitingElements.select("circle").transition().attr("r", 0);
    exitingElements.transition().attr("transform", "translate(0, 800)").remove();
  }
})



function buildXAndYAxis(xScale, yScale){
  let xAxisGroup = viz.append("g").attr("class", 'xaxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis)
  xAxisGroup.attr("transform", "translate(0, "+ (height-yPadding) +")")
  xAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate("+width/2+", 40)")
    .append("text")
    .attr("fill", "black")
    .text("fertility")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.7em")

  ;

  let yAxisGroup = viz.append("g").attr("class", 'yaxis');
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis)
  yAxisGroup.attr("transform", "translate("+xPadding+", 0)")

  yAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate(-33, "+height/2+") rotate(-90)")
    .append("text")
    .attr("fill", "black")
    .text("life expectancy")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.7em")

  ;
}
