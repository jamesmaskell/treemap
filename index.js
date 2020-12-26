window.addEventListener("DOMContentLoaded", event => {

    getData().then(response => {
        let videoGameData = response;
        //console.log(videoGameData)

        let root = d3.hierarchy(videoGameData);

        let colorScale = d3.scaleQuantize().domain([0,videoGameData.children.length - 1]).range(d3.schemeSpectral[9])

        d3.select("main").append("svg").attr("width", 1000).attr("height", 500);
        let svg = d3.select("svg");

        let map = colorScale(videoGameData.children.map(x => x.name).indexOf("N64"));
        console.log(map)

        let treeMapLayout = d3.treemap();

        treeMapLayout
        .size([1000,500])

        root.sum(d => d.value)

        treeMapLayout(root);

        console.log(root.leaves())

        svg.selectAll("g")
           .data(root.leaves())
           .enter()
           .append("g")
           .attr("transform", d => `translate(${d.x0},${d.y0})`)
        
        svg.selectAll("g")
           .append("rect")
           .attr("width", d => d.x1 - d.x0)
           .attr("height", d => d.y1 - d.y0)
           .attr("fill", d => colorScale(videoGameData.children.map(x => x.name).indexOf(d.data.category)))
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

        function handleMouseOver(e, d) {
             d3.select(this).attr("fill", "white")
        }
        function handleMouseOut(e, d) {
            d3.select(this).attr("fill", colorScale(videoGameData.children.map(x => x.name).indexOf(d.data.category)))
       }

    })

    function getData () {
        return fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").then(response => response.json());
    }

    


});