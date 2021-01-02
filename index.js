window.addEventListener("DOMContentLoaded", (event) => {
  let width = 1080;
  let height = 525;

  async function getData() {
    return await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").then((response) => response.json());
  }

  function draw() {
    getData().then((d) => {
      let dataObject = d;

      let highestLevelCategoryArray = dataObject.children.map((x) => x.name);
      let colours = generateColours(dataObject.children.length);

      let svg = d3.select("main").append("svg").attr("width", width).attr("height", 1000);

      // setup tree map
      let root = d3.hierarchy(dataObject);
      let treeMapLayout = d3.treemap().paddingInner(2);
      treeMapLayout.size([1080, 525]);
      root.sum((d) => d.value);
      root.sort((a, b) => {
        return b.value - a.value;
      });
      treeMapLayout(root);

      svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      svg
        .selectAll("g")
        .append("rect")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d, i) => colours[highestLevelCategoryArray.indexOf(d.data.category)])
        .attr("class", "tile")
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("mousemove", handleMouseMove);

      svg
        .selectAll("g")
        .append("text")
        .attr("y", 13)
        .attr("x", 3)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("font-size", "11px")
        .attr("font-family", "Tahoma")
        .html((d) => splitTitleString(d))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("mousemove", handleMouseMove);

      createLegend(svg.append("g").attr("id", "legend"), highestLevelCategoryArray, colours);
    });
  }

  function generateColours(parentDataPointCount) {
    let k = Math.ceil(parentDataPointCount / 6 + 1);

    let colours = [];
    colours = colours.concat(getSchemeColours(d3.schemeBlues[k]));
    colours = colours.concat(getSchemeColours(d3.schemeGreens[k]));
    colours = colours.concat(getSchemeColours(d3.schemeGreys[k]));
    colours = colours.concat(getSchemeColours(d3.schemeOranges[k]));
    colours = colours.concat(getSchemeColours(d3.schemePurples[k]));
    colours = colours.concat(getSchemeColours(d3.schemeReds[k]));

    return colours;
  }

  function getSchemeColours(scheme) {
    scheme.shift();
    return scheme;
  }

  function splitTitleString(d) {
    let skips = 0;
    let array = d.data.name.split(" ");
    let htmlString = "";
    for (let i = 0; i < array.length; i++) {
      if (13 * (1 + i) > d.y1 - d.y0) break;
      if (array[i].length <= 2 && i > 0) {
        let add = ` ${array[i]}</tspan>`;
        htmlString = htmlString.replace(/\<\/tspan\>$/g, add);
        skips++;
      } else htmlString += `<tspan x='${4}' y='${13 * (i + 1 - skips)}'>${array[i]}</tspan>`;
    }
    return htmlString;
  }

  function sortLegend(dataPoints, i) {
    let itemsPerColumn = Math.ceil(dataPoints / 3);
    let column = Math.ceil((i + 1) / itemsPerColumn);
    let row = (i + 1) % itemsPerColumn;
    row = row === 0 ? itemsPerColumn : row;
    return [column, row];
  }

  function handleMouseMove(e, d) {
    handleMouseOut(e, d);
    handleMouseOver(e, d);
  }

  function handleMouseOver(e, d) {
    d3.select("#tooltip")
      .html(`Title: ${d.data.name}<br>Category: ${d.data.category}<br>Units sold (millions): ${d.data.value}`)
      .style("background-color", "rgb(0,0,0,0.7)")
      .style("color", "whitesmoke")
      .style("padding", "10px")
      .style("border-radius", "3px")
      .style("top", `${e.pageY + 15}px`)
      .style("left", `${e.pageX + 15}px`)
      .style("display", "block")
      .attr("data-value", d.data.value);
  }
  function handleMouseOut(e, d) {
    d3.select("#tooltip").style("display", "none");
  }

  function createLegend(legend, highestLevelCategoryArray, colours) {
    let offset = (width - 450) / 2;

    legend
      .selectAll("rect")
      .data(highestLevelCategoryArray)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", (d, i) => offset + (sortLegend(highestLevelCategoryArray.length, i)[0] - 1) * 150)
      .attr("y", (d, i) => height + 25 + sortLegend(highestLevelCategoryArray.length, i)[1] * 20)
      .attr("fill", (d, i) => colours[highestLevelCategoryArray.indexOf(d)]);

    let labels = legend.append("text").attr("id", "legend-labels");

    labels
      .selectAll("tspan")
      .data(highestLevelCategoryArray)
      .enter()
      .append("tspan")
      .text((d) => d)
      .attr("width", 200)
      .attr("height", 20)
      .attr("x", (d, i) => offset + 25 + (sortLegend(highestLevelCategoryArray.length, i)[0] - 1) * 150)
      .attr("y", (d, i) => height + 35 + sortLegend(highestLevelCategoryArray.length, i)[1] * 20)
      .style("font-size", "12px");
  }

  draw();
});
