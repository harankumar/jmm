#!/bin/bash

mkdir ./raw_data

3>./raw_data/fannkuch-js.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d node ./fannkuch/js/src/fannkuch 5 > /dev/null
cd ./fannkuch/jmm/wasm
3>../../../raw_data/fannkuch-jmm-wasm.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d node fannkuch_jmm 5 > /dev/null
cd ../../..
3>./raw_data/fannkuch-jmm-bin.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d ./fannkuch/jmm/bin/fannkuch_jmm 5 > /dev/null
3>./raw_data/fannkuch-cpp.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d ./fannkuch/cpp/bin/fannkuch.gpp_run 5 > /dev/null

3>./raw_data/nbody-js.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d node ./nbody/js/src/nbody 6 > /dev/null
cd ./nbody/jmm/wasm
3>../../../raw_data/nbody-jmm-wasm.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d node ./nbody_jmm 6 > /dev/null
cd ../../..
3>./raw_data/nbody-jmm-bin.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d ./nbody/jmm/bin/nbody_jmm 6 > /dev/null
3>./raw_data/nbody-cpp.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d ./nbody/cpp/bin/nbody.gpp_run 6 > /dev/null

3>./raw_data/spectralnorm-js.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d node ./spectralnorm/js/src/spectralnorm 7 > /dev/null
cd ./spectralnorm/jmm/wasm
3>../../../raw_data/spectralnorm-jmm-wasm.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d node ./spectralnorm_jmm 7 > /dev/null
cd ../../..
3>./raw_data/spectralnorm-jmm-bin.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d ./spectralnorm/jmm/bin/spectralnorm_jmm 7 > /dev/null
3>./raw_data/spectralnorm-cpp.txt chrt -f 99 perf stat --log-fd 3 -r 100 -d ./spectralnorm/cpp/bin/spectralnorm.gpp_run 7 > /dev/null


