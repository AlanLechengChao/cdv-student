function generate() {
  let parentDiv = document.getElementById("squares-parent");
  console.log("works");
  let currentNumber = parentDiv.childElementCount;
  let value = document.getElementById("input-box").value;
  if (value > currentNumber) {
    for (let i = 0; i < value - currentNumber; i++){
      parentDiv.appendChild(document.createElement("div"));
    }
  }
  else if (value < currentNumber) {
    for (let i = 0; i < currentNumber - value; i++){
      parentDiv.removeChild(parentDiv.firstChild);
    }
  }
}
