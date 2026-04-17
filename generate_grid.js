const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'data', 'iupac_118.json');
const destPath = path.join(__dirname, 'src', 'data', 'periodic_table_grid.json');

const existing = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

const gridData = existing.map(e => {
  let period, xpos, ypos;
  const z = e.z;
  
  if (z === 1) { 
    period = 1; xpos = 1; ypos = 1; 
  } else if (z === 2) { 
    period = 1; xpos = 18; ypos = 1; 
  } else if (z >= 3 && z <= 10) { 
    period = 2; ypos = 2; 
    xpos = z <= 4 ? z - 2 : z + 8; 
  } else if (z >= 11 && z <= 18) {
    period = 3; ypos = 3;
    xpos = z <= 12 ? z - 10 : z; 
  } else if (z >= 19 && z <= 36) {
    period = 4; ypos = 4; 
    xpos = z - 18;
  } else if (z >= 37 && z <= 54) {
    period = 5; ypos = 5; 
    xpos = z - 36;
  } else if (z >= 55 && z <= 86) {
    period = 6;
    if (z <= 56) { 
      xpos = z - 54; ypos = 6; 
    } else if (z >= 57 && z <= 71) {
      xpos = z - 54; 
      ypos = 9;
    } else {
      xpos = z - 68;
      ypos = 6;
    }
  } else if (z >= 87 && z <= 118) {
    period = 7;
    if (z <= 88) { 
      xpos = z - 86; ypos = 7; 
    } else if (z >= 89 && z <= 103) {
      xpos = z - 86; 
      ypos = 10;
    } else {
      xpos = z - 100;
      ypos = 7;
    }
  }
  
  return { ...e, period, xpos, ypos };
});

fs.writeFileSync(destPath, JSON.stringify(gridData, null, 2));
console.log('Successfully created', destPath);
