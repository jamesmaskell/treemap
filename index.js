window.addEventListener("DOMContentLoaded", event => {

    getData().then(response => {
        let videoGameData = response;

        let root = d3.hierarchy(videoGameData);

        let colours = generateColours(videoGameData.children.length);

        d3.select("main").append("svg").attr("width", 1000).attr("height", 1000);
        let svg = d3.select("svg");

        let map = videoGameData.children.map(x => x.name);

        let treeMapLayout = d3.treemap();

        treeMapLayout
        .size([1000,500])

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

        svg.selectAll("g")
           .append("text")
           .text(d => d.data.name)
           .attr("y", 9)
           .attr("x", 1)
           .attr("font-size", "8px")

         svg.append("g").attr("id", "legend")
         let legend = d3.select("#legend")

         console.log(map)

         legend
         .selectAll("circle")
         .data(map)
         .enter()
         .append("circle")
         .attr("r", 5)
         .attr("cx", (d,i) => (i * 10) + 25)
         .attr("cy", 550)
         .attr("fill", (d, i) => colours[map.indexOf(d)])


        function handleMouseOver(e, d) {
             d3.select(this).attr("fill", "white")
        }
        function handleMouseOut(e, d) {
            d3.select(this).attr("fill", colours[map.indexOf(d.data.category)])
       }

    })

    function getData () {
        return fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").then(response => response.json());
    }

    function generateColours(parentDataPointCount) {
       
        let colours = [];
        let k = (parentDataPointCount / 6) + 1;
       
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