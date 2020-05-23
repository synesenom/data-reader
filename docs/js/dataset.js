const Dataset = (svg, rulers) => {
    let _ = {
        options: {
            shape: 'circle',
            radius: 5,
            display: false
        },
        data: [],
        marker: svg.append('circle')
            .attr('id', 'dataset-marker')
            .attr('class', 'control-element')
            .attr('cx', 100)
            .attr('cy', 100)
            .attr('r', 5),
        group: svg.append('g')
            .attr('class', 'dataset-group')
            .style('display', 'none')
    };

    // Some convenience methods.
    const getMarkerX = () => parseFloat(_.marker.attr('cx'));
    const getMarkerY = () => parseFloat(_.marker.attr('cy'));
    const setMarkerX = x => _.marker.attr('cx', x);
    const setMarkerY = y => _.marker.attr('cy', y);

    // Drag event.
    d3.drag()
        .on('drag', () => {
            _.marker.attr('cx', d3.event.x)
                .attr('cy', d3.event.y);
        })(_.marker);
    // Controls.
    d3.select('#dataset-marker-radius')
        .attr('value', _.options.radius)
        .on('change', function () {
            _.options.radius = d3.select(this).property('value');

            // Update marker.
            _.marker.attr('r', _.options.radius);

            // Update existing data points.
            d3.selectAll('.data-point').attr('r', _.options.radius);
        })
    d3.select('#dataset-display')
        .attr('checked', _.options.display ? 'checked' : null)
        .on('change', function() {
            _.options.display = d3.select(this).property('checked');
            _.group.style('display', _.options.display ? null : 'none');
        });
    d3.select('#dataset-save')
        .on('click', () => {
            // Get coordinates.
            const cx = getMarkerX();
            const cy = getMarkerY();
            const x = rulers.x.getCoordinate(cx);
            const y = rulers.y.getCoordinate(cy);
            const g = _.group.append('circle')
                .attr('class', 'data-point')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', _.options.radius)

            // Add data point to data.
            _.data.push({g, x, y});

            // Add to data set list.
            const entry = d3.select('#dataset-data-points').append('div')
                .attr('class', 'data-point-entry')
                .on('mouseenter', () => {
                    g.classed('highlight', true)
                        .attr('r', 30)
                        .style('fill', 'crimson')
                        .transition().duration(1000)
                        .attr('r', _.options.radius)
                        .style('fill', null);
                })
                .on('mouseleave', () => g.classed('highlight', false));
            entry.append('div')
                .attr('class', 'data-point-value')
                .text(`(${x.toPrecision(2)}, ${y.toPrecision(2)})`);
            entry.append('div')
                .attr('class', 'data-point-remove')
                .html('&#10005;')
                .attr('title', 'Remove data point')
                .on('click', () => {
                    entry.remove();
                    g.remove();
                });
        });
    d3.select('#dataset-download')
        .on('click', () => {
            // Prepare CSV file and blob.
            const csv = ['x,y'].concat(_.data.map(d => `${d.x},${d.y}`)).join('\n')
            const blob = new Blob([csv], {
                type: 'text/csv'
            });

            // Prepare anchor.
            const a = document.createElement('a')
            a.download = 'dataset.csv';
            a.href = URL.createObjectURL(blob);

            // Add anchor to body.
            document.body.appendChild(a);

            // Click on anchor.
            a.click();

            // Remove anchor.
            document.body.removeChild(a);
        })

    return {
        marker: {
            shift(dx, dy) {
                setMarkerX(getMarkerX() + dx);
                setMarkerY(getMarkerY() + dy);
            }
        }
    };
}
