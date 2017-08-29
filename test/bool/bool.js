let x = true;
let y = false;
let a = true;
let b = false;
let p = "a truthy string";
let q = ""; // falsey string
let r = 42; // truthy number
let s = 0; // falsey number

console.log("You should see a bunch of true printouts!");

console.log(!(x && y));
console.log(x && x);
console.log(!(b && x));
console.log(!y);
console.log(!!x);
console.log(x || y);
console.log(x || a);
console.log(!(b || y));
console.log(b == y);
console.log(a == x);
console.log(a != b);
console.log(a != false);
console.log(a == true);
console.log(b == false);
console.log(b != true);
console.log(true == true);
console.log(false != true);
console.log(false == false);
console.log(!false);
console.log(true && true);
console.log(true || true);
console.log(!(true && false));
console.log(true);
console.log(!(s && r));
console.log(!(p && q));
console.log(!!(p || q));
console.log(!!(s || r));
