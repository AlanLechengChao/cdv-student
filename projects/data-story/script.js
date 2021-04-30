// let w = 1200;
// let h = w * 0.6;
// let padding = 20;
let w = 1200;
let h = 800;
let padding = 60;
let index = 2;
let viz = d3.select("#viz-container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .style("background-color", "#222222");

d3.json("31.json").then(function(geoData) {
  d3.json('data-process/output.json').then(function(data) {
    console.log(data)
    let projection = d3.geoMercator().fitExtent([[padding,padding], [w-padding, h-padding]], geoData);
    let pathMaker = d3.geoPath(projection);
    let datapoints = viz.selectAll(".line").data(geoData.features, d => d.properties.name);
    datapoints.enter().append("path")
        .attr("class", "line")
        .attr("d", pathMaker)
        .attr("stroke", "grey")
        .attr("fill", "none");
    let coord = viz.selectAll(".point").data(data, d => d.number);
    coord.enter().append('circle')
        .attr('class', "point")
        .attr("cx", d => projection(d.coordinates)[0])
        .attr("cy", d => projection(d.coordinates)[1])
        .attr("fill", "red")
        .attr("r", 0.5)
        .attr("opacity", 1);
  })

})
