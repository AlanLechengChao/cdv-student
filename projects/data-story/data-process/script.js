// String.prototype.isAlphaNumeric = function() {
//   var regExp = /^[A-Za-z0-9]+$/;
//   return (this.match(regExp));
// };

d3.json("output.json").then(function(d) {
  console.log(d)
})

// d3.csv("convertcsv.csv").then(function(tableData){

//   tableData = tableData.filter(function(d){
//     return d.number.isAlphaNumeric()
//   })
//   console.log(tableData);

//   d3.json("data.json").then(function(websiteData){
//     tableData.forEach(function(d){
//       // console.log(d);
//       let csvNum = d.number;
//       console.log(csvNum);
//       if (csvNum.slice(0,2) == '5A'){
//         csvNum = "HP-J-" + csvNum.slice(2,5) + "-V"
//         // console.log(csvNum)

//       }
//       websiteData.data.forEach(function(wd){

//         let websiteNum = wd["公布编号"]||wd["编号SN："]||wd["公布编号："];
//         if(websiteNum == csvNum){
//           console.log(websiteNum, csvNum);
//         }

//       })
//     })
//   })
// })
