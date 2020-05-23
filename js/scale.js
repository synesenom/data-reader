const Scale = () => {
    let _ = {
        domain: [0, 100],
        range: [0, 1],
        fn: d3.scaleLinear()
            .domain([0, 100])
            .range([0, 1])
    };

    return {
        domain (lo, hi) {
            _.domain = [
                lo === null ? _.domain[0] : lo,
                hi === null ? _.domain[1] : hi
            ];
            _.fn.domain(_.domain);
        },
        range (lo, hi) {
            _.range = [
                lo === null ? _.range[0] : lo,
                hi === null ? _.range[1] : hi
            ];
            _.fn.range(_.range);
        },
        map: p => _.fn(p)
    };
};
