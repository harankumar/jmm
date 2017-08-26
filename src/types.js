module.exports = {
  infer: infer
}

const tern = new(require('tern').Server)({});
const deasync = require('deasync');

function infer(astNode) {
  const params = {
    query: {
      type: "type",
      file: "main",
      start: astNode.start,
      end: astNode.end
    }
  };

  let done = false;
  let data;
  tern.request(params, function(err, results) {
    if (err)
      console.log(err);

    data = results;
    done = true;
  })
  deasync.loopWhile(() => !done);

  return data;
}

function registerFile(src) {
  tern.addFile("main", src);
}
