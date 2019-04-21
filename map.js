// Define global variables
var HEIGHT = 500;
var SCALE = 1200, OPACITY = 0.75;
var legendText = ["Private", "Public"];

var width = d3.select(".stateMap").style('width').split("px");
var WIDTH = Math.round(Number(width[0])) - 200;

// D3 svg
var projection = d3.geo.albersUsa().translate([WIDTH / 2, HEIGHT / 2]) // Translate to center of screen
                .scale([SCALE]);

// Define path
var path = d3.geo.path().projection(projection);

// Define linear scale for output
var color = d3.scale.linear().range(["rgb(217,91,67)", "rgb(100,100,150)", "rgb(69,173,168)"]);

// Define SVG
var svg = d3.select("body")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

// Create the DIV
var div = d3.select("stateMap")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

d3.csv("./rawDataHelper/collegesLocation.csv", (data) => {
    d3.json("./rawDataHelper/us-states.json", (json) => {

        svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", () => {
            return 'rgb(69,173,168)';
        });

        // Not in US state
        var avoids = ["Aguadilla", "Null", "Ponce", null];

        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        // X coordinate
        .attr("cx", (d) => {
            var currentState = d.state;
            if (!avoids.includes(currentState)) {
                return projection([d.longitude, d.latitude])[0];
            }
        })
        // Y coordinate
        .attr("cy", (d) => {
            var currentState = d.state;
            if (!avoids.includes(currentState)) {
                return projection([d.longitude, d.latitude])[1];
            }
        })
        // The size of the circle
        .attr("r", (d) => {
            var currentState = d.state;
            if (!avoids.includes(currentState)) {
                return Math.sqrt(d.radius) * 5;
            }
        })
        .style("fill", (d) => {
            var currentControl = d.control;

            // Separate color by private or public control
            if (currentControl == "Public") {
                return "rgb(217,91,67)";
            } else {
                return "rgb(100,100,150)";
            }
        })
        .style("opacity", OPACITY)
        .on("mouseover", (d) => {

            // Get out the color inside div base on the control type
            var borderColor = '';
            if (d.control == "Public") {
                borderColor += "rgb(217,91,67)";
            } else {
                borderColor += "rgb(100,100,150)";
            }

            // Main Tooltip
            var html = hoverViewHTMLGenerator(d, borderColor, '');
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.9");
            $("#tooltip-container").show();
            d3.select("#tooltip-container")
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 20) + "px");
        })
        .on("mouseout", (d) => {
            $(this).attr("fill-opacity", "1.0");
            $("#tooltip-container").hide();
        });


        // Legend data for chart
        var legend = d3.select("body")
            .append('svg')
            .attr("class", "legend")
            .attr("width", 200)
            .attr("height", 200)
            .selectAll("g")
            .data(color.domain().slice().reverse())
            .enter()
            .append("g")
            .attr("transform", (i) => {
                return "translate(80, " + i * 30 + ")";
            });
        legend.append("rect")
            .attr("width", 19)
            .attr("height", 19)
            .style("fill", color)
            .style("opacity", OPACITY)

        legend.append("text")
            .data(legendText)
            .attr("x", 20)
            .attr("y", 10)
            .attr("dy", ".40em")
            .text((d) => { return d; });
    });
});