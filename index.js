(async () => {
  // Retrieve and process sales data
  const data = await (
    await fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
    )
  ).json();
  let platformNames = [];
  data.children.forEach((child) => {
    if (!platformNames.includes(child.name)) {
      platformNames.push(child.name);
    }
  });
  let colors = [];
  for (let index = 0; index < 18; index++) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    colors.push(`#${randomColor}`);
  }
  const colorScale = d3.scaleOrdinal().domain(platformNames).range(colors);
  // Set up graph container
  document.querySelector("#title").textContent = data.name;
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
  // Create graph legend and legend items
  const legend = d3
    .select("#chart-container")
    .append("svg")
    .attr("id", "legend")
    .attr("height", "50px")
    .attr("width", "100%");
  let position = {
    index: 0,
    row: 0,
  };
  data.children.forEach((child, index) => {
    const xOffset = 65;
    const yOffset = 25;
    legend
      .append("rect")
      .attr("class", "legend-item")
      .attr("fill", () => colorScale(child.name))
      .attr("height", "20px")
      .attr("width", "20px")
      .attr("x", () => `${position.index * xOffset}`)
      .attr("y", () => (position.row ? yOffset * position.row : "0"));
    legend
      .append("text")
      .text(() => child.name)
      .attr("x", `${position.index * xOffset + 22}`)
      .attr("y", () => (position.row ? yOffset * position.row + 20 : "20"));
    if (position.index + 1 >= data.children.length / 2) {
      position.index = 0;
      position.row += 1;
    } else {
      position.index += 1;
    }
  });
// Handle tooltip
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
  const handleMouseover = (d) => {
    const tooltipText = `<span>Name: ${d.data.name} </span><span>Category: ${d.data.category}</span><span>Value: ${d.data.value}</span>`;
    const { pageX, pageY } = d3.event;
    tooltip
      .attr("data-value", () => d.data.value)
      .style("left", `${pageX}px`)
      .style("top", `${pageY}px`)
      .style("visibility", "visible")
      .html(tooltipText);
  };
  // Create tree structure
  const root = d3.hierarchy(data).sum((d) => d.value);
  d3.treemap().size([innerWidth, innerHeight])(root);
  // Use tree structure to create chart
  chart
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("stroke", "white")
    .style("fill", (d) => colorScale(d.parent.data.name))
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", (d) => handleMouseover(d))
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
  // Add text labels
  chart
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .each(function (d) {
      const text = d3.select(this);
      const name = d.data.name;
      const words = d.data.name.split(/\s+/);
      let yOffset = 10;
      console.log(name, name.length, d.x1 - d.x0);
      if (name.length * 6 < d.x1 - d.x0) {
        text
          .append("tspan")
          .text(() => name)
          .attr("y", d.y0 + 10)
          .attr("x", d.x0);
        return;
      }

      words.forEach((item) => {
        text
          .append("tspan")
          .text(() => item)
          .attr("y", d.y0 + yOffset)
          .attr("x", d.x0);
        yOffset += 10;
      });
    })
    .attr("x", (d) => d.x0 + 2)
    .attr("y", (d) => d.y0 + 10)
    .attr("font-size", "10px");
})();
