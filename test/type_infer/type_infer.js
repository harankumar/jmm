/**
 * @param {Float64Array} u
 * @param {Float64Array} v
 * */
function Au(u,v) {
    for (var i=0; i<u.length; ++i) {
        var t = 0;
        for (var j=0; j<u.length; ++j)
            t += A(i,j) * u[j];
        v[i] = t;
    }
}