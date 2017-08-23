function fib(n) {
  if (n === 0)
    return 0;
  if (n === 1)
    return 1;
  return fib(n - 1) + fib(n - 2);
}

function better_fib(n) {
  let a = 0,
    b = 1,
    i = 2;
  while (i <= n) {
    let sum = a + b;
    a = b;
    b = sum;

    i++;
  }
  return b;
}

console.log(better_fib(40));
console.log(fib(40));
