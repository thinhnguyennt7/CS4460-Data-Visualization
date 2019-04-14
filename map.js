// Define global variables
var WIDTH = 960, HEIGHT = 500;
var SCALE = 1.0;


// D3 svg
var projection = d3.geo.albersUsa()
                .translate([WIDTH / 2, HEIGHT / 2]) // Translate to center of screen
                .scale([1000]);

// Define path
var path = d3.geo.path() // Convert GeoJSON to projection path
        .projection(projection);   // Use alberUSA projection

var colors = d3.scale.linear()
            .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

var svg = d3.select("body")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

d3.csv("./P5 Datasets/colleges.csv", (data) => {
    getPositionDetail(data, 0).then((result) => {
        // result.forEach((item) => {
        //     console.log(item);
        // })
        console.log(result);
    });
    // console.log(someFunction(data));
})


// Load GEOJSON data
d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", (data) => {
    d3.json("us-states.json", (json) => {
        name_id_map = {};
        id_name_map = {};

        for (var i = 0; i < data.length; i++) {
            var id = data[i].id;
            var stateName = data[i].name;

            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (stateName == jsonState) {
                    json.features[j].properties.visited = id;
                    break;
                }
            }
        }
        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", (d) => {
            // Get data value
            var value = d.properties.visited;
            if (value) {
                //If value exists…
                return colors(value);
            } else {
                //If value is undefined…
                return "rgb(213,222,217)";
            }
        });

        d3.csv("./P5 Datasets/colleges.csv", (data) => {
            svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => {
                var positionDetail = getPositionDetail(d.Name);
                return projection([positionDetail.longitude, positionDetail.latitude])[0];
            })
            .attr("cy", (d) => {
                var positionDetail = getPositionDetail(d.Name);
                return projection([positionDetail.longitude, positionDetail.latitude])[1];
            })
            .style("fill", "rgb(217,91,67)")
            .style("opacity", 0.85)
            .on("mouseover", (d) => {
                div.transition()
                        .duration(200)
                    .style("opacity", .9)
                //    div.text(d.place)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", (d) => {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        });
    });
});