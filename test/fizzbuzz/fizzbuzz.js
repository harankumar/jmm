// Simplest Version
console.log("Doing it the easy way!");
for (let i = 1; i < 100; i++) {
  if (i % 15 === 0)
    console.log("FizzBuzz");
  else if (i % 3 === 0)
    console.log("Fizz");
  else if (i % 5 === 0)
    console.log("Buzz");
  else
    console.log(i);
}

// Moderately More Elegant (?) Version
console.log("Doing it the slightly less easy way!");
for (let i = 1; i < 100; i++) {
  var temp = "";
  if (i % 3 == 0)
    temp += "Fizz";
  if (i % 5 == 0)
    temp += "Buzz";
  if (temp === "")
    temp += "" + i;
  console.log(temp);
}
