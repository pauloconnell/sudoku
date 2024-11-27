import { puzzlesAndSolutions } from './puzzle-strings.js';
//import { hintCheck } from '/hintCheck.js'
const textBox=document.getElementById('text-input');
const boardOption1=document.getElementById('board1');
const boardOption2=document.getElementById('board2');
document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textBox.value = puzzlesAndSolutions[1][0];  //set board to one in file - note first file is not solveable
  console.log("inside script"); 
  // boardOption1.innerHTML=puzzlesAndSolutions[2][0];
  // boardOption2.innerHTML=puzzlesAndSolutions[3][0];  
  textBoxChanged(); // call update to draw board

});
 console.log("inside beginning");
 
var cellArray=document.querySelectorAll(".sudoku-input");
const clearButton=document.querySelector('#clear-button');
const solveButton=document.querySelector('#solve-button');

const hintButton=document.querySelector('#hint-button');
//document.getElementById("#board1").addEventListener(onclick, newBoard1);
const board1Button=document.querySelector("#board1");
const board2Button=document.querySelector("#board2");
const board3Button=document.querySelector("#board3");
const board4Button=document.querySelector("#board4");

const errorBox=document.querySelector('#error-msg');


const regex= /^[1-9.]*$/;     // regex ensures input is digit or .
var rows=[];

var squareValueArray=[];
//define methods used:

let textBoxChanged=(e)=>{
  errorBox.innerText="";
  var valueArray= textBox.value.split('');
  if(regex.test(textBox.value)===false){      // use regex to enusre correct input
    errorBox.innerText='Error: Invalid Characters in TextBox - please correct the error-next time use the grid below for auto correction';
    console.log(e);
    return;
  }
  valueArray.forEach((val,index)=>{
    cellArray[index].value=val;               // load up cellArray with values
  });


}

let gridBoxChanged=(e)=>{
  cellArray.forEach((cell)=>{
    cell.style.backgroundColor="white"; // reset all cells to white color
  });
  errorBox.innerText="";
  console.log("inside gridBoxChanged");
  let textString='';
  cellArray.forEach((cell)=>{   // load up cellArray with data
    textString +=cell.value.toString();
  })
  if(regex.test(textString)===false){
    errorBox.innerText=('Error: Invalid Characters @ row/col '+e.target.id+"   Remember value 1 to 9 only. ");
    console.log(e.target.id); // do not allow input error
    document.getElementById(e.target.id).value="."; //target the cell with the error and change it back to '.'
    document.getElementById(e.target.id).style.backgroundColor="red"; // highlight error cell in red to show user
   
  }
  textBox.value=textString;
}
let clear=()=>{   // reset the board if clear pressed
  console.log("clear button pressed");
  textBox.value= puzzlesAndSolutions[1][0];
  textBoxChanged();
}

let hint=()=>{
  console.log("hint button pressed");
  hintCheck(textInput.value);
  //hintCheck will find any errors and change background color to yellow
}

let newBoard1=()=>{
   
    console.log("board  button pressed");
  textBox.value=puzzlesAndSolutions[1][0];
  textBoxChanged();
 }
let newBoard2=()=>{
  textBox.value=puzzlesAndSolutions[2][0];
  textBoxChanged();
}
let newBoard3=()=>{
    console.log("board1 button pressed");
  textBox.value=puzzlesAndSolutions[3][0];
  textBoxChanged();
}
let newBoard4=()=>{
  textBox.value=puzzlesAndSolutions[4][0];
  textBoxChanged();
}

let solveButtonPressed=()=>{
errorBox.innerHTML="computing, please wait-see console log for live calculation";
alert("about to solve, open console log for live calculation");
  var textBoxValues=textBox.value.split('');
  var playBoard=createBoard(textBoxValues);
  console.log("solve button pressed"+playBoard);
  var solution=solveFromHere(playBoard, 0, 0); // board,row,col
  if(solution){               // returns false if no solution
           // returns new board if solution
    return solution;
  }else{
       errorBox.innerText='Not solvable in current state-hit clear button to try again';
  };
  textBox.value=playBoard.join("");
  textBoxChanged();           // updates the board with the solution
  errorBox.innerText="Computing Done - if it's not solved now, IT'S NOT SOLVABLE";

}


let solveFromHere=(board, row,col)=>{
  var numberWorked=false;
  console.log(typeof(board[row])+board[row]+"board[row]"+board[row].charAt(col));
  
  if(board[row].charAt(col)!="."){
    console.log(board[row].charAt(col)+"number present, moving to next");
    let newRow=row;
    let newCol=col;
    if(col==8){
          newRow++;
          newCol=0;
          if(newRow==9){   // if last postion, we done!
            console.log("Board is solved!");
            return board;
          }
        } else newCol++;
        return solveFromHere(board,newRow,newCol); // now call for next location
  };
 
  console.log("Solving from row: "+row+" col: "+col);

  for(var number=1; number<10; number++){   // our numbers 1-9
    var value=number.toString();
      if(canPlace(board, row, col, value)){  
        console.log("current board at row#:"+row);
        var updateRow=board[row];
        //each row is actually a string of the numbers and "."
        console.log(typeof(updateRow)+updateRow);
        updateRow=updateRow.replace(".", value);  // pull out first "." and replace it with number
       board[row]=updateRow;
        console.log("Number Placed :)  "+board[row]+"is new row");
        console.log("updating board" +board.join(''));
        textBox.value=board.join("");
        textBoxChanged();           // updates the board with the solution
        let newRow=row;   // call from next location - update
        let newCol=col;
        if(col==8){
          newRow++;
          newCol=0
          if(newRow==9){    // if at last row, we are done
            return board;
          }
        } else newCol++;
       
        //check if we find a solution go to the next postion to check this solution = heart of recursive ()
        console.log("calling nextBoard "+newRow+newCol);
        var nextBoard=solveFromHere(board, newRow, newCol);
        if(nextBoard){
          board=nextBoard
          console.log("nextBoard is true");
          return board;       // if next solution works
        } else{             // if this doesn't work:
          console.log("correcting wrong path !trying next num "+value);
          console.log("Start "+board[row]+' remove '+value+typeof(board[row]));
          let temp=board[row];
          let index=temp.indexOf(value);
          console.log(col+" is col, and index to remove is "+index);                   
          temp=temp.replace(value, ".");
          console.log(temp+" is temp row");
          board[row]=temp;     // reset this spot
          console.log("saved, now backtracked board is: "+board[row]+"row/col"+row+col);

          //now need to move col back one:
          if (col>0){
            col--;
          }else{
            if(row>0){
              row--;
            }else return false; // we can't go back further
          }
        }



        console.log("row is now :", board[row]);
        textBox.value=board.join("");
        textBoxChanged();           // updates the board with the solution
        if(col==8){
          console.log("debugging row = "+row);
          row =row+1;
          console.log("debugging row is now = "+row);
          col=0;
          if(row==9){
            return board;
          }
        } else col++;

        
        }else{              // closes if(canPlace()
          if (number==9){
             console.log("no number found, must go back...")
              textBox.value=board.join("");
              textBoxChanged();           // updates the board with the solution
            console.log(board[row]+" is current row ");
            return false;
          }
        }
        console.log(col+" is col, and number is at "+number);
       if (number>8){
         return false;                     // tried all numbers, not working, no solution, return false
       }
    } // end of for loop (number)

    console.log("new board is ", board);
    textBox.value=board.join("");
    textBoxChanged();           // updates the board with the solution
    return board;
  }   // closes solve from here 


// adds listeners 
textBox.oninput=textBoxChanged;      // monitor textBox
clearButton.onclick=clear;            // buttons
solveButton.onclick=solveButtonPressed;
//add listener for all cells in grid
cellArray.forEach((cell,index)=>{     // monitor sudoku grid
    cell.oninput=gridBoxChanged;
    
  });
// add listners for new board buttons
board1Button.onclick=newBoard1;
board2Button.onclick=newBoard2;
board3Button.onclick=newBoard3;
board4Button.onclick=newBoard4;




let createBoard=(values)=>{
  console.log("inside createBoard");
  var board=[[],[],[],[],[],[],[],[],[]]; // this will hold our model of the board for AI solving
  var currentRow=0;
  var currentColumn=0;
  let counter=0;
  let row=[];
  for(var x=0; x<81; x++){
    var nextNum=values[x];

    row.push(nextNum);
    currentColumn++;
    if(currentColumn>=9){     // create new row every 9 entries
      currentColumn=0;
      board[currentRow]=row.join(''); //adds each STRING row to board 
       currentRow++;
      row=[]; 
    }
  }
  console.log(board[0]);
  return board;
}

let canPlace=(board,row,col,num)=>{
  console.log("canPlace called with col ", col);
  let response=false;
  if(checkRow(board,row,num)){
    if(checkColumn(board,col,num)){
      console.log(num+"passed check in column "+col);
      if(checkSquare(board,row,col,num)){
        return true;
      }
    }
  }
  return response;
}

let checkRow=(board, row, num)=>{
  let thisRow=board[row];
  let thisNum;
  let response=true;
  console.log(row+" row #, num="+num+" contents: "+board[row]);
  //console.log(currentColumn+" is column");
  console.log(typeof(thisRow));
  for (var x = 0; x < 9; x++) {
    //access each character in this row
    thisNum=thisRow.charAt(x);
    if(thisNum == num){
      response =false;
      break;
    }
  }
    console.log("row:"+row+" completed checkRow can place num  "+num+"=? "+ response);
  return response;

}
let checkColumn=(board, column, num)=>{
  console.log("inside column checking col "+column);
  let response=true;
  for(var i=0; i<9; i++){
    if(board[i][column]==(num)){
      console.log(" we found match in column "+column );
      
      return false;
    } 

  }
  return response; 
}

// this function will determine which square the num is in, 
let checkSquare=(board, row, column, num)=>{
  console.log("inside check Square with row/col/num "+row,column,num);
  var squareValues;
  var squareStarts=[];  //will have [row,column] indicating start of square to check

  let findRow=()=>{
    switch( row > 5 ? "bottom" :
        row > 2 ? "mid" :
        row < 3 ? "top" : false
        ){
          case ("top"):
            squareStarts.push(0);   // row 0, 
            break;
          case "mid":  
            squareStarts.push(3); //row 3            
            break;
          case "bottom":
            squareStarts.push(6); //row 6
            break;
                
         }
      }
  
    let findColumn=()=>{
      switch( column > 5 ? "right" :
        column > 2 ? "mid" :
        column < 3 ? "left" :false){
         case "right": 
            squareStarts.push(6); // column 6
            break;

          case "mid":
          
            squareStarts.push(3); // colum 3
            break;
         case "left":
          squareStarts.push(0);   // column 0
          break;
    }
  }
  findRow();      // find square's starting row
  findColumn();   //  " "   column
  var checkMe;
  var column=squareStarts.pop();
  var row=squareStarts.pop();
  var foundMatch=false;
  squareValueArray=[];
  console.log("Our square starts @ ", column, row);
  for (var i=row; i<(row+3); i++ ){               // get values from square put into squareValueArray
    for (var x=column; x<(column+3); x++){
      if(board[i][x]==num) foundMatch=true;       // search if number is in square
      squareValueArray.push(board[i][x]);         // load array with values from square
      console.log("Our square is ", squareValueArray.join(""), foundMatch);
      if(foundMatch){
         x=column+3;                              // if we found this number in this square, end this search
         i=row+3;
      }
    }
   
  }
  console.log("Does our square "+squareValueArray+" include num: "+ num +foundMatch);
  if (foundMatch) return false   // returns true if num already exists in square
  else return true;
}


/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {

  }
} catch (e) {}
