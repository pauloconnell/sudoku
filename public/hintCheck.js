import { puzzlesAndSolutions } from './puzzle-strings.js';
module.exports = function (valueString) {

let valueArray=valueString.split("");
valueArray.forEach((box, index)=>{
  if(box.value=='.') return;
  if(box.value==puzzlesAndSolutions[index]){
    box.style.background=white;
  }
  if (box.value!=puzzlesAndSolutions[index]){
    box.style.background=yellow;
  }

})
}