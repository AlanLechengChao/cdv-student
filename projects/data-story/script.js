// main viz width and height
let w = window.innerWidth;
let h = window.innerHeight;
let padding = 10;

// state machines
const START = 0;
const BASEPOINT = 1;
const VIEWING = 2;
const DISPLAYING = 3;

// two pointers storing the state machines
let previousState = null;
let state = START;

// main viz
let viz = d3.select("#viz-container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .style("background-color", "#ffffff");

// text iterator
let content = d3.select("#content-container");
let contentIndex = 0;
let contents = ["This is the map of Shanghai, a city with complicated history. During different periods, buildings begin to emerge around the city. This includes but not limited to buildings built before the colonial stage, and during the years when Western Countries built up concessions."
                , "However, some of the buildings suffer from severe damage. Hence, in 1989, the Shanghai Government initiated the first list of heritage buildings. And throughout the years, 5 batches of buildings are being protected.",
                ""];
// legends
let legends = viz.append("text")
                  .text("Map of Shanghai")
                  .attr('x', w-200)
                  .attr('y', 50)
                  .attr('font-family', 'Inconsolata')
                  .attr('font-weight', 600);
// for the scrolling effect
let interval;

let leftViz = d3.select('#left-content')
                  .append("svg")
                  .attr("preserveAspectRatio", "xMinYMin meet")
                  .attr("viewBox", "0 0 "+w+" "+h)
                  .classed("svg-content", true);
let leftVizAxis = leftViz.append("g").attr("transform", "translate(0, 600)");


d3.json("31.json").then(function(geoData) {
  d3.json('data-process/output.json').then(function(data) {
    let categoryName = ["first/1989", "second/1994", "third/1999", "fourth/2003", "fifth/2015"];

    let category = [0,0,0,0,0];
    data.forEach(function(d) {
        category[d.number[0] - 1] ++;
    })
    let categoryG;
    console.log(category);

    // d3.zoom function
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
          img.className = "photo";
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
    console.log(data);

    // click to show website
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

    // d3 map part
    let projection = d3.geoMercator()
                          .fitExtent([[padding,padding], [w-padding, h-padding]], geoData);
    let pathMaker = d3.geoPath(projection);

    let datapoints = viz.selectAll(".line").data(geoData.features, d => d.properties.name);

    let geos = datapoints.enter().append("path")
                  .attr("class", "line")
                  .attr("d", pathMaker)
                  .attr("stroke", "darkgray")
                  .attr("fill", "none");

    let coord = viz.selectAll(".point")
                      .data(data, d => d.number);
    let names = viz.selectAll('.names')
                      .data(geoData.features, d => d.properties.name);

    // default point display                  
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
    
    // district name              
    let texts = names.enter().append('text').text(d => d.properties.name)
                  .attr("font-size", 12)
                  .attr("x", d => {
                    return projection(d.properties.cp)[0];
                  })
                  .attr("y", d => projection(d.properties.cp)[1]);
    // zoom function              
    viz.call(zoom);



    var lastMove = 0;
    function zoomed() {
      if(Date.now() - lastMove > 40) {
        // Do stuff
        lastMove = Date.now();

        let e = d3.event.transform;
        switch (state) {
          case START:
            // previousState = state;
            var l = Math.floor(contents[contentIndex].length * ((e.k-1) / 14));
            // console.log(l);
            content.text(contents[contentIndex].slice(0,l));
            if (e.k == 15) {
              state = BASEPOINT;
            }
            if (e.k == 1) {
              if (previousState == BASEPOINT) {
                contentIndex += 1;
                state = VIEWING;
              }
            }
            break;

          case BASEPOINT:
            // zoom.on("zoom", null);
            points.transition()
                          .duration(300)
                          .delay((d,i) => i*1)
                          .attr("r", 0.3)
                          .attr("opacity", 0.7);
              // zoom.on("zoom", zoomed);
              previousState = state;
              state = START;
              break;

          case VIEWING:
              var l = Math.floor(contents[contentIndex].length * ((e.k-1) / 14));
              let scale = d3.scaleBand()
                              .domain(categoryName.slice(0, 5*((e.k-1) / 14)))
                              .range([0,1200])
                              .paddingInner(0.4)
                              .paddingOuter(0.12)
                              .align(0.5);

              let axis = d3.axisBottom(scale);

              leftVizAxis.transition()
                            .call(axis)
                            .attr("font-size", "40")
                            .selectAll("text")
                            .attr("transform", "rotate(-20) translate(-40, 40)");

              categoryG = leftViz.selectAll(".bars")
                                .data(category
                                .slice(0, 5*((e.k-1) / 14)));

              let lengthScale = d3.scaleLinear()
                                .domain(d3.extent(category, d => d))
                                .range([40, 500]);

              categoryG.exit().remove();
              let enteringElements = categoryG.enter().append("g").attr("class", "bars");
              enteringElements.append("rect").transition()
                                .attr("width", scale.bandwidth())
                                .attr("height", d => lengthScale(d))
                                .attr("transform", function(d,i) {
                                  return `translate(${scale(categoryName[i])}, ${600 - lengthScale(d)})`
                                })
                                .attr("fill", function(d,i) {
                                    switch (i) {
                                      case 0:
                                        return "#C3EB7A"
                                        break;
                                      case 1:
                                        return "#F2BD66"
                                        break;
                                      case 2:
                                        return "#DB677E"
                                        break;
                                      case 3:
                                        return "#7966F2"
                                        break;
                                      case 4:
                                        return "#61E8D6"
                                        break;
                                    }
                                });
              
              enteringElements.append("text")
                                .transition()
                                .text(d => d).attr("transform", function(d,i) {
                                  return `translate(${scale(categoryName[i])}, ${600 - lengthScale(d)})`
                                })
                                .attr("font-size", 50);

              categoryG.select("text")
                          .transition()
                          .text(d => d)
                          .attr("transform", function(d,i) {
                            return `translate(${scale(categoryName[i])}, ${600 - lengthScale(d)})`
                          })
                          .attr("font-size", 50);


              categoryG.select("rect").transition()
                                .attr("width", scale.bandwidth())
                                .attr("height", d => lengthScale(d))
                                .attr("transform", function(d,i) {
                                  return `translate(${scale(categoryName[i])}, ${600 - lengthScale(d)})`
                                }).attr("fill", function(d,i) {
                                    switch (i) {
                                      case 0:
                                        return "#C3EB7A"
                                        break;
                                      case 1:
                                        return "#F2BD66"
                                        break;
                                      case 2:
                                        return "#DB677E"
                                        break;
                                      case 3:
                                        return "#7966F2"
                                        break;
                                      case 4:
                                        return "#61E8D6"
                                        break;
                                    }
                                }).attr("opacity", 0.5);
              categoryG.select("rect").on("mouseover", function(d,i) {
                d3.select(this).attr("cursor", "pointer");
                d3.select(this).transition().attr("opacity", 1);

              points.transition().attr('r', function(_d){
                  if (_d.number[0] == i+1) {
                    return 1
                  }else {
                    return 0.3
                  }
                })
              });

              categoryG.select("rect")
                        .on("mouseout", function(d,i) {
                          d3.select(this).attr("cursor", "auto");
                          d3.select(this)
                              .transition()
                              .attr("opacity", 0.5);
                          points.transition()
                                  .attr('r', 0.3);
                        });

              points.on("mouseover", function(d) {
                d3.select(this).attr("cursor", "pointer");
                d3.select(this).transition().attr("r", 1);
                categoryG.select("rect").transition().attr("opacity", function(_d, _i) {
                  if (_i+1 == d.number[0]) return 1
                  else {
                    return 0.5
                  }
                });
                categoryG.select("text").transition().attr("font-size", function(_d, _i) {
                  if (_i+1 == d.number[0]) return 80
                  else {
                    return 50
                  }
                });
              });
              points.on("mouseout", function(d) {
                d3.select(this).attr("cursor", "auto");
                d3.select(this).transition().attr("r", 0.3);
                categoryG.select("rect").transition().attr("opacity", 0.5);
                categoryG.select("text").transition().attr("font-size", function(_d, _i) {
                  return 50
                });
              })
              points.transition().attr("fill", function(d,i) {
                if (i < data.length * ((e.k-1) / 14) ) {
                  switch (parseInt(d.number[0])) {
                    case 1:
                      return "#C3EB7A"
                      break;
                    case 2:
                      return "#F2BD66"
                      break;
                    case 3:
                      return "#DB677E"
                      break;
                    case 4:
                      return "#7966F2"
                      break;
                    case 5:
                      return "#61E8D6"
                      break;
                  }
                }
                else {
                  return "grey"
                }
              }).attr("r", function(d,i) {
                if (i < data.length * ((e.k-1) / 14) ) {
                  return "0.3"
                }
                else {
                  return "0.1"
                }
              });
              content.text(contents[contentIndex].slice(0,l));

              break;
        }

        geos.attr("transform", e).attr("stroke-width", 1/e.k);
        points.attr("transform", e);
        texts.attr("transform", e).attr("font-size", 12/e.k);
      }
    }
  })


})
