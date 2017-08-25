//NUMBERS STUFF
let y = 4;
let b = y > 2; // Boolean stuff with numbers
b = y === 2;
b = y == 2;
b = y != 2;
b = y > 2;
b = y < 2;
let c = y + 1; // Binary operations
c = y - 100;
c = y * 0.1423;
c = y / 22;
c = y % 2123;
// y += 1; // Assignment operations
// y -= 1;
// y /= 1.323;
// y *= 123123;
// y %= 2;
// y++;
// y--;

// LOOPY STUFF
for (let k = 0; k < 100; k++) {
  console.log(k);
}

let i = 0;
do {
  i++;
} while (i < 100);

while (i < 150) {
  i++;
}

// IF/ELSE
if (i < 100)
  console.log("<");
else if (i == 100)
  console.log("==");
else
  console.log(">");

// SWITCH STATEMENTS
let x = 5;
switch (x) {
  case 5:
  case 4:
    console.log("It's 4 or 5");
  case 3:
    console.log("It's 3 or 4 or 5");
    break;
  case 2:
    console.log("It's 2");
  default:
    console.log("Not 2, 3, 4, or 5");
}

switch (x) {
  default: console.log("Hello World!");
}

switch (x) {

}

switch (x) {
  case 4:
    console.log("blarg");
}
