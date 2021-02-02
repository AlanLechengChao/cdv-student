let districts = [];

let raw_data = [
  {
    "timestamp": "2021-01-29T04:13:04.251Z",
    "huangpuDistrict": 6,
    "xuhuiDistrict": 1,
    "changningDistrict": 2,
    "jinganDistrict": 3,
    "putuoDistrict": 0,
    "hongkouDistrict": 1,
    "yangpuDistrict": 1,
    "pudongNewArea": 8
  },
  {
    "timestamp": "2021-01-29T04:15:13.037Z",
    "huangpuDistrict": 4,
    "xuhuiDistrict": 7,
    "changningDistrict": 8,
    "jinganDistrict": 8,
    "putuoDistrict": 6,
    "hongkouDistrict": 3,
    "yangpuDistrict": 5,
    "pudongNewArea": 8
  },
  {
    "timestamp": "2021-01-29T04:16:10.216Z",
    "huangpuDistrict": 0,
    "xuhuiDistrict": 0,
    "changningDistrict": 0,
    "jinganDistrict": 0,
    "putuoDistrict": 0,
    "hongkouDistrict": 0,
    "yangpuDistrict": 0,
    "pudongNewArea": 7
  },
  {
    "timestamp": "2021-01-29T04:16:25.874Z",
    "huangpuDistrict": 7,
    "xuhuiDistrict": 5,
    "changningDistrict": 2,
    "jinganDistrict": 6,
    "putuoDistrict": 1,
    "hongkouDistrict": 6,
    "yangpuDistrict": 5,
    "pudongNewArea": 8
  },
  {
    "timestamp": "2021-01-29T04:29:16.499Z",
    "huangpuDistrict": 7,
    "xuhuiDistrict": 6,
    "changningDistrict": 0,
    "jinganDistrict": 5,
    "putuoDistrict": 0,
    "hongkouDistrict": 6,
    "yangpuDistrict": 4,
    "pudongNewArea": 4
  },
  {
    "timestamp": "2021-01-29T04:34:12.738Z",
    "huangpuDistrict": 9,
    "xuhuiDistrict": 9,
    "changningDistrict": 2,
    "jinganDistrict": 6,
    "putuoDistrict": 2,
    "hongkouDistrict": 2,
    "yangpuDistrict": 3,
    "pudongNewArea": 6
  },
  {
    "timestamp": "2021-01-29T05:27:17.949Z",
    "huangpuDistrict": 5,
    "xuhuiDistrict": 3,
    "changningDistrict": 4,
    "jinganDistrict": 6,
    "putuoDistrict": 3,
    "hongkouDistrict": 2,
    "yangpuDistrict": 2,
    "pudongNewArea": 6
  },
  {
    "timestamp": "2021-01-29T05:54:39.331Z",
    "huangpuDistrict": 7,
    "xuhuiDistrict": 8,
    "changningDistrict": 2,
    "jinganDistrict": 6,
    "putuoDistrict": 1,
    "hongkouDistrict": 4,
    "yangpuDistrict": 3,
    "pudongNewArea": 9
  },
  {
    "timestamp": "2021-01-29T07:44:03.609Z",
    "huangpuDistrict": 3,
    "xuhuiDistrict": 2,
    "changningDistrict": 0,
    "jinganDistrict": 3,
    "putuoDistrict": 1,
    "hongkouDistrict": 1,
    "yangpuDistrict": 3,
    "pudongNewArea": 6
  },
  {
    "timestamp": "2021-01-29T08:18:23.939Z",
    "huangpuDistrict": 7,
    "xuhuiDistrict": 10,
    "changningDistrict": 5,
    "jinganDistrict": 7,
    "putuoDistrict": 2,
    "hongkouDistrict": 3,
    "yangpuDistrict": 2,
    "pudongNewArea": 5
  },
  {
    "timestamp": "2021-01-29T09:10:42.358Z",
    "huangpuDistrict": 7,
    "xuhuiDistrict": 7,
    "changningDistrict": 1,
    "jinganDistrict": 8,
    "putuoDistrict": 1,
    "hongkouDistrict": 1,
    "yangpuDistrict": 1,
    "pudongNewArea": 10
  },
  {
    "timestamp": "2021-01-29T11:10:51.077Z",
    "huangpuDistrict": 3,
    "xuhuiDistrict": 1,
    "changningDistrict": 1,
    "jinganDistrict": 8,
    "putuoDistrict": 3,
    "hongkouDistrict": 1,
    "yangpuDistrict": 2,
    "pudongNewArea": 7
  },
  {
    "timestamp": "2021-01-29T11:37:45.540Z",
    "huangpuDistrict": 8,
    "xuhuiDistrict": 8,
    "changningDistrict": 3,
    "jinganDistrict": 8,
    "putuoDistrict": 4,
    "hongkouDistrict": 3,
    "yangpuDistrict": 7,
    "pudongNewArea": 10
  },
  {
    "timestamp": "2021-01-30T06:31:10.162Z",
    "huangpuDistrict": 4,
    "xuhuiDistrict": 7,
    "changningDistrict": 0,
    "jinganDistrict": 8,
    "putuoDistrict": 5,
    "hongkouDistrict": 4,
    "yangpuDistrict": 0,
    "pudongNewArea": 8
  },
  {
    "timestamp": "2021-01-30T18:43:08.212Z",
    "huangpuDistrict": 10,
    "xuhuiDistrict": 4,
    "changningDistrict": 9,
    "jinganDistrict": 10,
    "putuoDistrict": 2,
    "hongkouDistrict": 4,
    "yangpuDistrict": 8,
    "pudongNewArea": 10
  }
];

let domElements = [];

class DistrictsDiv {
  constructor(name, avg, sd){
    this.name = name; // string
    this.avg = avg;
    this.sd = sd;
    this.container = document.createElement("div");

  }
  showBasic() {
    this.container.className = "district_box";
    this.container.id = this.name;
    this.container.innerHTML = this.name.split(/(?=[A-Z])/).join(" ").toLowerCase();
    document.getElementById("map_base").appendChild(this.container);
  }
  showData() {
    let databox = document.createElement("div");
    databox.id = this.name + "-data";
    databox.className = "databox";
    this.container.appendChild(databox);
    // databox.style.width =
    databox.style.height = this.name + parseInt((this.avg / 10) * 200)  + "px";
    console.log();


  }
}

let processedData = tranformData(raw_data);
console.log(processedData);

function tranformData(data) {
  // a mutant version of Leon's function
  let newData = [];
  let keys = Object.keys(data[0]);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (isNaN(data[0][key])){
      continue;
    }
    let sum = 0;
    let same_catagory_sequence = [];
    for (let j = 0; j < data.length; j++) {
      if (key in data[j]) {
        same_catagory_sequence.push(data[j][key]);
        sum += data[j][key];
      }
    }
    let avg = (sum / same_catagory_sequence.length).toFixed(2);
    let variance = 0;
    for (let k = 0; k < same_catagory_sequence.length; k++) {
      variance += Math.pow(same_catagory_sequence[k] - avg, 2);
    }
    variance /= same_catagory_sequence.length;
    let standard_deviation = Math.sqrt(variance).toFixed(2);

    let newDataPoint = {"name": key, "average": avg, "standardDeviation": standard_deviation, "numMeaurements": same_catagory_sequence.length};
    newData.push(newDataPoint);
  }
  return newData;
}

for (let i = 0; i < processedData.length; i++) {
  domElements.push(new DistrictsDiv(processedData[i].name, processedData[i].average, processedData[i].name));
}

for (let i = 0; i < domElements.length; i++) {
  domElements[i].showBasic();
  domElements[i].showData();
}
