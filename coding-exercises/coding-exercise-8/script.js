let w = 1200;
let h = 800;
let padding = 60;

let index = 2;

// SVG
let viz = d3.select("#container").append("svg")
    .style("width", w)
    .style("height", h)
    .style("background-color", "#222222")
;


// IMPORT DATA
d3.json("31.json").then(function(geoData){
  d3.csv("shanghaidata.csv").then(function(shanghaiData) {
    console.log(geoData);
    console.log(shanghaiData);
    setInterval(update, 2000);
    let params = [{name: "GDP", domain: undefined, color: "red"},
    {name: "livingPopulation", domain: undefined, color: "blue"},
    {name: "GDPperPerson", domain: undefined, color: "green"},
    {name: "Area", domain: undefined, color: "violet"},
    {name: "GDPperArea", domain: undefined, color: "orange"}]
    params.forEach(p => {p.domain = d3.extent(shanghaiData, d => parseFloat(d[p.name]))})
    let ColorScaler;
    let projection = d3.geoMercator().translate([w/2], [h/2]).fitExtent([[padding,padding], [w-padding, h-padding]], geoData);
    let pathMaker = d3.geoPath(projection);
    update();
    function update() {
      let h1 = document.getElementById("datapoint").innerHTML = params[index].name;
      console.log(index)
      ColorScaler = d3.scaleLinear().domain(params[index].domain).range(["white", params[index].color]);
      let datapoints = viz.selectAll(".line").data(geoData.features, d => d.properties.name);
      let enteringElements = datapoints.enter();
      enteringElements.append("path")
          .attr("class", "line")
          .attr("d", pathMaker)
          .attr("stroke", "none")
          .transition()
          .duration(500)
          .attr("fill", function(geoD) {
            let corresponding = shanghaiData.find(d => d.district == geoD.properties.name);
            return ColorScaler(corresponding[params[index].name])
          });
      console.log(datapoints.select("path"));
      datapoints.transition().duration(500).attr("fill", function(geoD) {
        let corresponding = shanghaiData.find(d => d.district == geoD.properties.name);
        return ColorScaler(corresponding[params[index].name])
      });
      index += 1;
      index %= params.length;
    }

  })
  // PRINT DATA





})
