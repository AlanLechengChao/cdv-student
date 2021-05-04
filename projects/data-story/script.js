let w = window.innerWidth;
let h = window.innerHeight;
let padding = 10;
// let index = 2;
const START = 0;
const BASEPOINT = 1;
const VIEWING = 2;
const DISPLAYING = 3;
let state = START;
let viz = d3.select("#viz-container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .style("background-color", "#ffffff");
let content = d3.select("#content-container");
let contentS = "This is the map of Shanghai, a city with complicated history. During different periods, buildings begin to emerge around the city.";
let legends = viz.append("text")
                  .text("Map of Shanghai")
                  .attr('x', w-200)
                  .attr('y', 50)
                  .attr('font-family', 'Inconsolata')
                  .attr('font-weight', 600);
let interval;



d3.json("31.json").then(function(geoData) {
  d3.json('data-process/output.json').then(function(data) {
    let zoom = d3.zoom()
        .extent([[0, 0], [w, h]])
        .scaleExtent([1, 15])
        .on("zoom", zoomed);
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
          return "grey"
        }
      }).attr('r', function (d) {
        if (d.number == selected.number) {
          console.log("s")
          return 4
        }else {
          return 0.3
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
                  .attr("stroke", "darkgray")
                  .attr("fill", "none");
    let coord = viz.selectAll(".point").data(data, d => d.number);
    let names = viz.selectAll('.names').data(geoData.features, d => d.properties.name);
    let points = coord.enter().append('circle')
                  .attr('class', "point")
                  .attr('opacity', 0)
                  .attr('r', 0)
                  .attr("cx", d => projection(d.coordinates)[0])
                  .attr("cy", d => projection(d.coordinates)[1])

                  .attr("fill", d => {
                    // if (d.currentName == "住宅" || d.previousName == "住宅") {
                    //   return "green"
                    // } else {
                    //   return "blue"
                    // }
                      return "grey"
                  });
    let texts = names.enter().append('text').text(d => d.properties.name)
                  .attr("font-size", 12)
                  .attr("x", d => {
                    return projection(d.properties.cp)[0];
                  })
                  .attr("y", d => projection(d.properties.cp)[1]);

    viz.call(zoom);

    function zoomed() {
      let e = d3.event.transform;
      console.log(e);
      switch (state) {
        case START:
          let l = Math.floor(contentS.length * ((e.k-1) / 14));
          console.log(l);
          content.text(contentS.slice(0,l));
          if (e.k == 15) {
            state = BASEPOINT;
          }
          break;
        case BASEPOINT:
          zoom.on("zoom", null);
          points.transition()
                        .duration(300)
                        .delay((d,i) => i*1)
                        .attr("r", 0.3)
                        .attr("opacity", 0.7);
            zoom.on("zoom", zoomed);
            state = START;
            break;
          // case VIEWING:
          //
          //   break;
      }
      geos.attr("transform", e).attr("stroke-width", 1/e.k);
      points.attr("transform", e);
      texts.attr("transform", e).attr("font-size", 12/e.k);
    }
  })


})
