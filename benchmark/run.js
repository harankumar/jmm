const Benchmark = require('benchmark');

const execSync = require("child_process").execSync;

const params = {
    "fannkuch": 12,
    "spectralnorm": 5500,
    "nbody": 50000000
};

for (let prog of ["fannkuch", "spectralnorm", "nbody"]) {
    const param = params[prog];
    const suite = new Benchmark.Suite;

    suite
        .add(prog + "-js", function () {
            execSync(`node ./${prog}/js/src/${prog}.js ${param}`)
        })
        .add(prog + "-jmm-bin", function () {
            execSync(`./${prog}/jmm/bin/${prog}_jmm ${param}`)
        })
        .add(prog + "-jmm-wasm", function () {
            execSync(`cd ./${prog}/jmm/wasm/ && node ${prog}_jmm.js ${param} && cd ../../..`)
        })
        .add(prog + "-cpp-bin", function () {
            execSync(`./${prog}/cpp/bin/${prog}.gpp_run ${param}`)
        });

    suite
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        .run({
            async: true,
            maxTime: 1
        });
}


