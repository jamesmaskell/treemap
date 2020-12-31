window.addEventListener("DOMContentLoaded", event => {

    getData().then(response => {
        let videoGameData = response;

        let root = d3.hierarchy(videoGameData);

        console.log()

        let colours = generateColours(videoGameData.children.length);

        d3.select("main").append("svg").attr("width", 1080).attr("height", 1000);
        let svg = d3.select("svg");

        let map = videoGameData.children.map(x => x.name);

        let treeMapLayout = d3.treemap();

        treeMapLayout
        .size([1080,525])

        root.sum(d => d.value)
        root.sort((a,b) => {
            return b.value - a.value;
        })

        treeMapLayout(root);

        svg.selectAll("g")
           .data(root.leaves())
           .enter()
           .append("g")
           .attr("transform", d => `translate(${d.x0},${d.y0})`)
        
        svg.selectAll("g")
           .append("rect")
           .attr("width", d => d.x1 - d.x0)
           .attr("height", d => d.y1 - d.y0)
           .attr("fill", (d,i) => colours[map.indexOf(d.data.category)])
           .attr("class", "tile")
           .attr("data-name", d => d.data.name)
           .attr("data-category", d => d.data.category)
           .attr("data-value", d => d.data.value)
           .on("mouseover", handleMouseOver)
           .on("mouseout", handleMouseOut)
           .on("mousemove", handleMouseMove)

        svg.selectAll("g")
           .append("text")
           .attr("y", 13)
           .attr("x", 3)
           .attr("width", d => d.x1 - d.x0)
           .attr("height", d => d.y1 - d.y0)
           .attr("font-size", "11px")
           .attr("font-family", "Tahoma")
           .html(d => splitTitleString(d))
           .on("mouseover", handleMouseOver)
           .on("mouseout", handleMouseOut)
           .on("mousemove", handleMouseMove)


           
         
         function splitTitleString(d) {
            let skips = 0;
            let array = d.data.name.split(" ");
            let htmlString = "";
            for (let i = 0; i < array.length; i++) {
                if ((13 * (1+i)) > (d.y1 - d.y0)) {
                    break;
                }                
                if (array[i].length <= 2 && i > 0) {
                    let add = ` ${array[i]}</tspan>`
                    htmlString = htmlString.replace(/\<\/tspan\>$/g, add)
                    skips++
                } else
                {
                    htmlString += `<tspan x='${4}' y='${13 * (i + 1 - skips)}'>${array[i]}</tspan>`
                }
                    
            }
            return htmlString;
         }
         
         
         svg.append("g").attr("id", "legend")
         let legend = d3.select("#legend")

         console.log(map)

         legend
         .selectAll("rect")
         .data(map)
         .enter()
         .append("rect")
         .attr("class", "legend-item")
         .attr("width", 10)
         .attr("height", 10)
         .attr("x",  (d, i) => (sortLegend(map.length, i)[0] * 50) + (75 * (sortLegend(map.length, i)[0] - 1)))
         .attr("y", (d,i) => 550 + (sortLegend(map.length, i)[1] * 20))
         .attr("fill", (d, i) => colours[map.indexOf(d)])

         legend.append("text").attr("id", "legend-labels");
         let labels = d3.select("#legend-labels");
         labels.selectAll("tspan")
         .data(map)
         .enter()
         .append("tspan")
         .text(d => d)
         .attr("width", 200)
         .attr("height", 20)
         .attr("x", (d, i) => (sortLegend(map.length, i)[0] * 75) + (50 * (sortLegend(map.length, i)[0] - 1)))
         .attr("y", (d,i) => 560 + (sortLegend(map.length, i)[1] * 20)) //(d,i) => 560 + (i * 20)
         .style("font-size", "12px")
         
         function sortLegend(dataPoints, i) {
            let itemsPerColumn = Math.ceil(dataPoints / 3);

            let column = Math.ceil((i + 1) / itemsPerColumn)
            let row = (i + 1) % itemsPerColumn;

            row = (row === 0) ? itemsPerColumn : row;

            return [column, row];
         }

        function handleMouseMove(e, d) {
            handleMouseOut(e, d)
            handleMouseOver(e, d)
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
               .attr("data-value", d.data.value)

        }
        function handleMouseOut(e, d) {
            d3.select("#tooltip").style("display", "none")
       }

    })

    function getData () {
        //return fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").then(response => response.json());
        return fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json").then(response => response.json());
        //return fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json").then(response => response.json());
    }

    function generateColours(parentDataPointCount) {
       
        console.log(parentDataPointCount)

        let colours = [];
        let k = Math.ceil((parentDataPointCount / 6) + 1);
       


        let _temp;

        let blues = d3.schemeBlues[k];
        blues.shift()
        colours = colours.concat(blues);

        let greens = d3.schemeGreens[k];
        greens.shift()
        colours = colours.concat(greens);

        let greys = d3.schemeGreys[k];
        greys.shift()
        colours = colours.concat(greys);

        let oranges = d3.schemeOranges[k];
        oranges.shift()
        colours = colours.concat(oranges);

        let purples = d3.schemePurples[k];
        purples.shift()
        colours = colours.concat(purples);

        let reds = d3.schemeReds[k];
        reds.shift()
        colours = colours.concat(reds);

        return colours;
    }

});