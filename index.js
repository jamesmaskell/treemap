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
        .size([960,570])

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
           .attr("id", d => `cid${d.data.category}_${d.data.name.replace(/\s|&|\.|\:|\/|\(|\)|!/g,"_")}`)
        
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
           .attr("id", d => `text${d.data.category}_${d.data.name.replace(/\s|&|\.|\:|\/|\(|\)|!/g,"_")}`)
           .attr("y", 13)
           .attr("x", 3)
           .attr("width", d => d.x1 - d.x0)
           .attr("height", d => d.y1 - d.y0)
           .attr("font-size", "11px")
           .attr("font-family", "Tahoma")
           .html(d => splitTitleString(d))



           
         
         function splitTitleString(d) {
            let skips = 0;
            let array = d.data.name.split(" ");
            let htmlString = "";
            for (let i = 0; i < array.length; i++) {
                if ((13 * (1+i)) > (d.y1 - d.y0)) {
                    break;
                }                
                if (array[i].length <= 2) {
                    let add = ` ${array[i]}</tspan>`
                    htmlString = htmlString.replace(/\<\/tspan\>$/g, add)
                    skips++
                } else
                {
                    htmlString += `<tspan x='${3}' y='${13 * (i + 1 - skips)}'>${array[i]}</tspan>`
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
         .attr("x", 50)
         .attr("y", (d,i) => 550 + (i * 20))
         .attr("fill", (d, i) => colours[map.indexOf(d)])


        function handleMouseMove(e, d) {
            handleMouseOut(e, d)
            handleMouseOver(e, d)
        }

        function handleMouseOver(e, d) {
            d3.select("#tooltip")
                .html(`Game: ${d.data.name}<br>Console: ${d.data.category}<br>Units sold (millions): ${d.data.value}`)
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
            //d3.select(this).attr("fill", colours[map.indexOf(d.data.category)])
            d3.select("#tooltip").style("display", "none")
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