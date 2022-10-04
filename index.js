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
    const chartHeight = 1000;
    const chartWidth = 1000;
    const innerHeight = chartHeight - margin.top - margin.bottom;
    const innerWidth = chartWidth - margin.left - margin.right;
    const chart = d3
        .select("#chart-container")
        .append("svg")
        .attr("height", chartHeight)
        .attr("width", chartWidth);
    const root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap().size([innerWidth, innerHeight])(root);

    const colorScale = d3.scaleOrdinal().domain(platformNames).range(colors)
    chart.selectAll('rect')
        .data(root.leaves())
        .enter().append('rect')
        .attr('x', (d) => {
            return d.x0
        }
        )
        .attr('y', d => d.y0)
        .attr('width', d => {
            console.log(d)
            return d.x1 - d.x0
        })
        .attr('height', d => d.y1 - d.y0)
        .style('stroke', "black")
        .style('fill', d => colorScale(d.parent.data.name))
        .attr('class', 'tile')
    console.log(root.leaves())
    console.log(d3)
    console.log(data)
})();