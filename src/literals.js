module.exports = {
  walkLiteral: walkLiteral
}

const compiler = require('./compiler');
const walk = compiler.walk;
const type_infer = require('./type_infer').infer;

function walkLiteral(astNode) {
  const val = astNode.value;
  switch (typeof val) {
    case "string":
      return `String::from("${val}")`;
    case "number":
      return `({${val} as f64})`;
    case "boolean":
      return val.toString();
  }
}
