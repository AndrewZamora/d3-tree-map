(async () => {
    const data = await (await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')).json();
    const title = document.querySelector('#title');
    title.textContent = data.name;
    let platformNames = [];
    data.children.forEach(child => {
        if (!platformNames.includes(child.name)) {
            platformNames.push(child.name)
        }
    });
    let colors = [];
    for (let index = 0; index < 18; index++) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        colors.push(`#${randomColor}`);
    }
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const chartHeight = 900;
    const chartWidth = 900;
    const innerHeight = chartHeight - margin.top - margin.bottom;
    const innerWidth = chartWidth - margin.left - margin.right;
    const chart = d3
        .select("#chart-container")
        .append("svg")
        .attr("height", chartHeight)
        .attr("width", chartWidth);
    const legend = d3
        .select("#chart-container")
        .append('svg')
        .attr("id", "legend")
        .attr("height", "50px")
        .attr("width", "100%");
    let position = {
        index: 0,
        row: 0
    };
    data.children.forEach((child, index) => {
        const xOffset = 60;
        const yOffset = 25;
        legend
            .append('rect')
            .attr("class", "legend-item")
            .attr('fill', 'green')
            .attr('height', '20px')
            .attr('width', '20px')
            .attr('x', () => {
                return `${position.index * xOffset}`
            })
            .attr('y', () => {
                if(position.row) {
                    return yOffset * position.row
                }
                return '0'
            })

        if ((position.index + 1) > data.children.length / 2) {
            position.index = 0;
            position.row += 1;
        } else {
            position.index += 1;
        }
        legend
            .append('text')
            .text(() => child.name)
            .attr('x', `${(index * xOffset) + 20}`)
            .attr('y', '20')
    });
    const root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap().size([innerWidth, innerHeight])(root);

    const colorScale = d3.scaleOrdinal().domain(platformNames).range(colors);
    const tooltip = d3
        .select("#chart-container")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("font-size", "12px")
        .style("background", "#333")
        .style("color", "#FFF")
        .style("border-radius", "4px")
        .style("padding", "10px");
    chart
        .selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('x', (d) => {
            return d.x0
        }
        )
        .attr('y', d => d.y0)
        .attr('width', d => {
            return d.x1 - d.x0
        })
        .attr('height', d => d.y1 - d.y0)
        .style('stroke', "black")
        .style('fill', d => colorScale(d.parent.data.name))
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .on('mouseover', d => {
            const tooltipText = d.data.name;
            const { pageX, pageY } = d3.event;
            tooltip
                .attr('data-value', () => d.data.value)
                .style("left", `${pageX}px`)
                .style("top", `${pageY}px`)
                .style("visibility", "visible")
                .html(tooltipText);
        })
        .on('mouseout', () => tooltip.style("visibility", "hidden"));
    // Add Text Labels
    chart
        .selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
        .each(function (d) {
            const text = d3.select(this);
            const name = d.data.name
            const textFontSize = 1;
            const words = d.data.name.split(/\s+/);
            let yOffset = 10;
            console.log(name, name.length, (d.x1 - d.x0))
            if ((name.length * 6) < (d.x1 - d.x0)) {
                text.append('tspan')
                    .text(() => name)
                    .attr('y', d.y0 + 10)
                    .attr('x', d.x0)
                return
            }

            words.forEach(item => {
                text.append('tspan')
                    .text(() => item)
                    .attr('y', d.y0 + yOffset)
                    .attr('x', d.x0)
                yOffset += 10

            })
        })
        .attr('x', (d) => d.x0 + 2)
        .attr('y', d => d.y0 + 10)
        .attr('font-size', '10px')
    console.log(root.leaves())
    console.log(d3)
    console.log({ data })
})();