let w = 1200;
let h = w * 0.6;
let padding = 20;

let viz = d3.select("#viz-container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .style("background-color", "yellow");

d3.json("31.json").then(function(geoData) {
  console.log(geoData.features)
  let projection = d3.geoMercator().fitExtent([[padding,padding], [w-padding, h-padding]], geoData);
  let pathMaker = d3.geoPath(projection);
  let datapoints = viz.selectAll(".line").data(geoData.features, d => d.properties.name);
  datapoints.enter().append("path")
      .attr("class", "line")
      .attr("d", pathMaker)
      .attr("stroke", "grey")
      .attr("fill", "none");
})
