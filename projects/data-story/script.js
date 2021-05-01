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
              .style("background-color", "white");
let interval;


d3.json("31.json").then(function(geoData) {
  d3.json('data-process/output.json').then(function(data) {
    function appendWebsite(s) {
      let box = document.createElement("div");
      box.id = "infobox";
      // box.style.top = `${projection(s.coordinates)[0]}px`;
      box.style.top = "30%";
      box.style.left = "10%";
      j = s.website;
      for ([key, value] of Object.entries(j)) {
        if (key == "image") {
          let img = document.createElement("img");
          img.src = value;
          box.appendChild(img);
        }
        else {
          let tag = document.createElement("h3");
          tag.innerHTML = key;
          let content = document.createElement("p");
          content.innerHTML = value;
          box.appendChild(tag);
          box.appendChild(content);
        }
      }
      return box
    }
    console.log(data)
    window.addEventListener("keydown", key => {
      if (key.code == "Enter") {
        console.log("w")
        selectPoint();

      }
    })

    function selectPoint() {

      let withInfo = data.filter(d => d.website);
      let selected = withInfo[parseInt(Math.random() * withInfo.length)];
      console.log(selected);
      points.transition().attr('fill', function (d) {
        if (d.number == selected.number) {
          console.log("s")
          return "red"
        }else {
          return "gray"
        }
      }).attr('r', function (d) {
        if (d.number == selected.number) {
          console.log("s")
          return 4
        }else {
          return 0.5
        }
      }).attr("z-index", 99);
      if (document.getElementById("infobox")) {
        document.getElementById("infobox").remove();
      }
      let website = appendWebsite(selected);
      document.body.appendChild(website);

      clearInterval(interval);
      interval = setInterval(autoScroll, 100);
      function autoScroll() {
        // console.log("worked")
        document.getElementById("infobox").scrollBy(0,2, 'smooth');
      }
    }
    let projection = d3.geoMercator().fitExtent([[padding,padding], [w-padding, h-padding]], geoData);
    let pathMaker = d3.geoPath(projection);
    let datapoints = viz.selectAll(".line").data(geoData.features, d => d.properties.name);
    let geos = datapoints.enter().append("path")
        .attr("class", "line")
        .attr("d", pathMaker)
        .attr("stroke", "black")
        .attr("fill", "none");
    let coord = viz.selectAll(".point").data(data, d => d.number);
    let names = viz.selectAll('.names').data(geoData.features, d => d.properties.name);
    let texts = names.enter().append('text').text(d => d.properties.name)
                  .attr("x", d => {
                    return projection(d.properties.cp)[0];
                  })
                  .attr("y", d => projection(d.properties.cp)[1]);
    let points = coord.enter().append('circle')
        .attr('class', "point")
        .attr("cx", d => projection(d.coordinates)[0])
        .attr("cy", d => projection(d.coordinates)[1])
        .attr("fill", d => {
          // if (d.currentName == "住宅" || d.previousName == "住宅") {
          //   return "green"
          // } else {
          //   return "blue"
          // }
          if (d.website) {
            return "red"
          } else {
            return "grey"
          }
        })
        .attr("r", 0.5)
        .attr("opacity", 0.7);
    viz.call(d3.zoom()
        .extent([[0, 0], [w, h]])
        .scaleExtent([1, 10])
        .on("zoom", zoomed));

    function zoomed() {
      let e = d3.event.transform;
      console.log(e);
      geos.attr("transform", `translate(${e.x}, ${e.y}) scale(${e.k})`).attr("stroke-width", 1/e.k);
      points.attr("transform", `translate(${e.x}, ${e.y}) scale(${e.k})`);
      texts.attr("transform", `translate(${e.x}, ${e.y}) scale(${e.k})`).attr("font-size", 10/e.k);
    }
  })

})
