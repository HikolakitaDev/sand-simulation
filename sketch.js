function array(cols,rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length;i++) {
    arr[i] = new Array(rows);
    for (let j = 0;j < arr[i].length;j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

let grid;
let w = 10;
let cols, rows;
let currentTool = "sand"; 

function setup() {
  createCanvas(400, 400);
  cols = floor(width/w);
  rows = floor(height/w);
  grid = array(cols, rows);
  
  // Create tool buttons
  let sandButton = createButton('Sand');
  sandButton.position(10, height + 10);
  sandButton.mousePressed(() => currentTool = "sand");
  
  let wallButton = createButton('Wall');
  wallButton.position(70, height + 10);
  wallButton.mousePressed(() => currentTool = "wall");
  
  let eraserButton = createButton('Eraser');
  eraserButton.position(130, height + 10);
  eraserButton.mousePressed(() => currentTool = "eraser");

  grid[20][10] = 1;
}

function mouseDragged() {
  let col = floor(mouseX / w);
  let row = floor(mouseY / w);
  
  if (col >= 0 && col <= cols-1 && row >= 0 && row <= rows-1) {
    if (currentTool === "sand") {
      grid[col][row] = 1; // 1 = sand
    } else if (currentTool === "wall") {
      grid[col][row] = 2; // 2 = wall
    } else if (currentTool === "eraser") {
      grid[col][row] = 0; // 0 = empty
    }
  }
}

function mousePressed() {
  mouseDragged();
}

function draw() {
  background(220);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * w;
      stroke(100);
      
      if (grid[i][j] === 0) {
        fill(255);
      } else if (grid[i][j] === 1) {
        let brightness = map(j, 0, rows, 255, 100); 
        fill(brightness, brightness, 0);
      } else if (grid[i][j] === 2) {
        fill(80, 80, 80);
      }
      
      square(x, y, w);
    }
  }

  let nextGrid = array(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 2) {
        nextGrid[i][j] = 2;
      }
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) { 
        let below = j + 1 < rows ? grid[i][j + 1] : null;
        
        let dir = random(1) < 0.5 ? 1 : -1;
        
        let belowR = (j + 1 < rows && i + dir >= 0 && i + dir < cols) ? grid[i + dir][j + 1] : null;
        let belowL = (j + 1 < rows && i - dir >= 0 && i - dir < cols) ? grid[i - dir][j + 1] : null;

        if (below === 0) {
          nextGrid[i][j + 1] = 1;
        }
        else if (belowR === 0) {
          nextGrid[i + dir][j + 1] = 1;
        }
        else if (belowL === 0) {
          nextGrid[i - dir][j + 1] = 1;
        }
        else {
          nextGrid[i][j] = 1;
        }
      }
    }
  }
  
  grid = nextGrid;

  fill(0);
  noStroke();
  textSize(16);
  text(`Current Tool: ${currentTool}`, 10, height - 10);
}