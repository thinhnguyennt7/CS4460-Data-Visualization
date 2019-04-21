
// Setting up data
d3.csv("./P5 Datasets/colleges.csv", (data) => {
    settingUpDropdown('#areasFilter', '#controlTypeFilter', '#admissionFilter', '#averageFilter', data);
});

var WIDTH = 600, HEIGHT = 600;
var configure = {top: 50, right: 50, bottom: 50, left: 50}
var radius = 5;

// Chart draw begin
d3.csv("./P5 Datasets/colleges.csv", (data) => {
    for (var i = 0; i < data.length; i++) {
        var current = data[i];
        data[i].NAME = String(current.Name);
        data[i].CONTROL = String(current.Control);
        data[i].REGION = String(current.Region);
        data[i].RATE = Number(current["Admission Rate"]);
        data[i].TUITION = Number(current["Average Cost"]);
        data[i].POPULATION = Number(current["Undergrad Population"]);
    }

    var colorScale = d3.scale.category10()

    var rateExtent = d3.extent(data, (d) => {
        return d.RATE;
    })

    var tuitionExtent = d3.extent(data, (d) => {
        return d.TUITION;
    })

    var xScale = d3.scale.linear().domain(tuitionExtent).range([0, WIDTH]);
    var yScale = d3.scale.linear().domain(rateExtent).range([HEIGHT, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(10)
        .orient("bottom")

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient("left")

    var populationLists = [];
    data.forEach(row => {
        populationLists.push(row["Undergrad Population"]);
    });
    var maxPopulation = d3.max(populationLists);
	var populationScale = d3.scale.linear().domain([0, maxPopulation]).range([2, 6]);


    var chart = d3.select(".rateChart")
        .append("svg:svg")
        .attr("width", WIDTH + configure.left + configure.right)
        .attr("height", HEIGHT + configure.top + configure.bottom)
        .append("g")
        .attr("transform", "translate(" + configure.left + ',' + configure.top + ')')

    chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
        return xScale(d.TUITION);
    })
    .attr("cy", (d) => {
        return yScale(d.RATE);
    })
    .attr("r", (d) => {
        return populationScale(d["Undergrad Population"]);
    })
    .attr('stroke','white')
    .attr("fill", (d, i) => {
        return colorScale(i);
    })
    .on("mouseover", function (d) {
        d3.select(this)
        .transition()
        .duration(800).style("opacity", 1)
        .attr("r", radius * 4).ease("elastic");
    })
    .on("mouseout", function(d) {
        d3.select(this)
        .transition()
        .duration(500)
        .attr("r", (d) => {
            return populationScale(d["Undergrad Population"]);
        });
    })
    .on("click", (d) => {
        updateSchoolDetailSingleView(d);
    })
    .append("title").text((d) => {
        return 'School Name: ' + d.Name + '\nAdmission Rate: ' + d['Admission Rate'] + '\nAverage Tuition: ' + d['Average Cost'];
    })

        chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + HEIGHT + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", 30)
            .attr("x", WIDTH / 2 + configure.left + configure.left)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Average Tuition")

        chart
            .append("g")
            .attr('class', 'axis')
            .call(yAxis)
            .append('text')
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x',-WIDTH / 2 / 2 + configure.top)
            .attr('y',5)
            .attr('dy','.71em')
            .style('text-anchor','end')
            .text('Admission Rate %')

        // Select Button
        var filterButton = d3.select("#filterNow");
        filterButton.on("click", () => {

            // Clear out the table detail view show
            d3.select("table").remove();
		    d3.select(".detail-table").remove();

            var areaList = [], admissionList = [], tuitionList = [], controlList = [];
            var avoidVal = "Choose...";

            $("#areasFilter").find(":selected").each(function() {
                if ($(this).val() != avoidVal) {
                    areaList.push($(this).val());
                }
            });

            $("#controlTypeFilter").find(":selected").each(function() {
                if ($(this).val() != avoidVal) {
                    controlList.push($(this).val());
                }
            });

            $("#admissionFilter").find(":selected").each(function() {
                if ($(this).val() != avoidVal) {
                    admissionList.push($(this).text());
                }
            });

            $("#averageFilter").find(":selected").each(function() {
                if ($(this).val() != avoidVal) {
                    tuitionList.push($(this).text());
                }
            });

            chart.selectAll("circle").attr('r', (data) => {
                // If we need to filter something
				if (regionChecking(data, areaList) && admissionChecking(data, admissionList) && controlTypeChecking(data, controlList) && tuitionChecking(data, tuitionList)) {
                    return populationScale(data["POPULATION"]);
                }
                return 0;
            })
        })

        // BRUSH
        // var brush = d3.svg.brush()
        //     .x(xScale)
        //     .y(yScale)
        //     .on("brushstart", handleBrushStart)
        //     .on('brush', handleBrushMove)
        //     .on('brushend', handleBrushEnd)

        // var container1 = chart.append("g").attr("class", "brush")
        //     .call(brush);

        // chart.selectAll(".end").data(brush.extent())
        //     .enter()
        //     .append("g")
        //     .attr("class", () => {
        //         return "end";
        //     })

        // function handleBrushStart() {
        //     console.log("Brush Start");
        // }

        // function handleBrushMove() {
        //     // container1.call(brush.clear());
        //     var sel = d3.event.selection;
        //     console.log("BRUSHING");
        //     if (!sel) return;

        //     var e = brush.extent();
        //     svg.selectAll("circle").filter((d) => {
        //     return e[0][0] > d.TUITION || d.TUITION > e[1][0]
        //         || e[0][1] > d.RATE || d.RATE > e[1][1];
        //     }).classed("selected", true);
        // }

        // function handleBrushEnd() {
        //     var sel = d3.event.selection;
        //     if (!sel) {
        //         d3.selectAll("circle").classed("selected", false);
        //     }
        // }

        // function highlight() {
        //     chart.selectAll(".end").data(extent).attr("transform", (d) => {
        //         chart.selectAll("circle").classed("selected", false);
        //         //highlight brushed circles
        //         chart.selectAll("circle").filter((d) => {
        //             return extent[0][0] > d.TUITION || d.TUITION > extent[1][0] || extent[0][1] > d.RATE || d.RATE > extent[1][1];
        //             console.log("brushing");
        //         }).classed("selected", true);
        //     });
        // }
})