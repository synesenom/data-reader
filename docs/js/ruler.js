const Ruler = (svg, axis) => {
    // Constants.
    const X0 = 50 + (axis === 'x' ? 20 : 0);
    const Y0 = 50 + (axis === 'y' ? 20 : 0);
    const HANDLE_RADIUS = 6;
    const DEFAULTS = {
        LENGTH: 100,
        FIXED: false
    };

    // TODO Add stroke width to controls.
    // TODO Add handle radius to controls.
    let _ = (() => {
        // SVG element.
        const options = {
            fixed: DEFAULTS.FIXED
        };
        let length = DEFAULTS.LENGTH;
        let group = svg.append('g')
            .attr('id', `${axis}-ruler`);

        const dom = (() => {
            let _ = {
                line: group.append('line')
                    .attr('class', 'ruler-line control-element')
                    .attr('x1', X0 + (axis === 'x' ? HANDLE_RADIUS : 0))
                    .attr('y1', Y0 + (axis === 'y' ? HANDLE_RADIUS : 0))
                    .attr('x2', X0 + (axis === 'x' ? length - HANDLE_RADIUS : 0))
                    .attr('y2', Y0 + (axis === 'y' ? length - HANDLE_RADIUS : 0)),
                start: group.append('circle')
                    .attr('class', 'ruler-start control-element')
                    .attr('cx', X0)
                    .attr('cy', Y0)
                    .attr('r', HANDLE_RADIUS),
                end: group.append('circle')
                    .attr('class', 'ruler-end control-element')
                    .attr('cx', X0 + (axis === 'x' ? length : 0))
                    .attr('cy', Y0 + (axis === 'y' ? length : 0))
                    .attr('r', HANDLE_RADIUS)
            };

            const getStart = () => parseFloat(_.start.attr(`c${axis}`));
            const getEnd = () => parseFloat(_.end.attr(`c${axis}`));
            const getLength = () => getEnd() - getStart();

            return {
                getPos () {
                    return [
                        parseFloat(_.start.attr(`cx`)),
                        parseFloat(_.start.attr(`cy`))
                    ];
                },
                getStart,
                setStart (p) {
                    _.line.attr(`${axis}1`, p + HANDLE_RADIUS);
                    _.start.attr(`c${axis}`, p);
                },
                getEnd,
                setEnd (p) {
                    _.line.attr(`${axis}2`, p - HANDLE_RADIUS);
                    _.end.attr(`c${axis}`, p);
                },
                setLine (x, y, m) {
                    m = m || 0;
                    const length = getLength();
                    const p1 = m - HANDLE_RADIUS;
                    const p2 = length - m - HANDLE_RADIUS;
                    const x1 = x - (axis === 'x' ? p1 : 0);
                    const y1 = y - (axis === 'y' ? p1 : 0);
                    const x2 = x + (axis === 'x' ? p2 : 0);
                    const y2 = y + (axis === 'y' ? p2 : 0);
                    _.line.attr('x1', x1)
                        .attr('y1', y1)
                        .attr('x2', x2)
                        .attr('y2', y2);
                    _.start.attr('cx', x - (axis === 'x' ? m : 0))
                        .attr('cy', y - (axis === 'y' ? m : 0));
                    _.end.attr('cx', x + (axis === 'x' ? length - m : 0))
                        .attr('cy', y + (axis === 'y' ? length - m : 0));
                },
                g: {
                    line: _.line,
                    start: _.start,
                    end: _.end
                }
            };
        })();

        // Scale.
        const scale = Scale();

        return {options, dom, scale};
    })();

    // Add drag events.
    let m = 0;
    d3.drag()
        .on('drag', () => {
            if (_.options.fixed) {
                return;
            }
            const p = Math.min(d3.event[axis], _.dom.getEnd() - 20);
            _.dom.setStart(p);
            _.scale.domain(p, null);
        })(_.dom.g.start);
    d3.drag()
        .on('drag', () => {
            if (_.options.fixed) {
                return;
            }
            const p = Math.max(d3.event[axis], _.dom.getStart() + 20);
            _.dom.setEnd(p);
            _.scale.domain(null, p);
        })(_.dom.g.end);
    d3.drag()
        .on('start', () => {
            if (_.options.fixed) {
                return;
            }
            m = d3.event[axis] - _.dom.getStart();
        })
        .on('drag', () => {
            if (_.options.fixed) {
                return;
            }
            _.dom.setLine(d3.event.x, d3.event.y, m);
        })
        .on('end', () => {
            _.scale.domain(_.dom.getStart(), _.dom.getEnd());
        })(_.dom.g.line);

    // Connect to form.
    d3.select(`#${axis}-ruler-fixed`)
        .attr('checked', DEFAULTS.FIXED ? 'checked' : null)
        .on('change', function () {
            _.options.fixed = d3.select(this).property('checked');
        });
    d3.select(`#${axis}-ruler-start`)
        .attr('value', 0)
        .on('change', function () {
            _.scale.range(parseFloat(d3.select(this).property('value')), null);
        });
    d3.select(`#${axis}-ruler-end`)
        .attr('value', DEFAULTS.LENGTH)
        .on('change', function () {
            _.scale.range(null, parseFloat(d3.select(this).property('value')));
        });

    return {
        getCoordinate: d => _.scale.map(d),
        line: {
            shift(dx, dy) {
                if (_.options.fixed) {
                    return;
                }
                const p = _.dom.getPos();
                _.dom.setLine(p[0] + dx, p[1] + dy);
                _.scale.domain(_.dom.getStart(), _.dom.getEnd());
            }
        },
        start: {
            shift(dx, dy) {
                if (_.options.fixed) {
                    return;
                }
                _.dom.setStart(_.dom.getStart() + (axis === 'x' ? dx : dy));
                _.scale.domain(_.dom.getStart(), _.dom.getEnd());
            }
        },
        end: {
            shift(dx, dy) {
                if (_.options.fixed) {
                    return;
                }
                _.dom.setEnd(_.dom.getEnd() + (axis === 'x' ? dx : dy));
                _.scale.domain(_.dom.getStart(), _.dom.getEnd());
            }
        }
    };
}
