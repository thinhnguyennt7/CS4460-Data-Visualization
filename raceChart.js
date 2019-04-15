
// Setting up data
d3.csv("./P5 Datasets/colleges.csv", (data) => {

    var duplicatedSet = new Set();
    var set = new Set();
    var areaOption = '<option selected>Choose...</option>';
    var controlOption = '<option selected>Choose...</option>';
    for (var i = 0; i < data.length; i++) {

        var currentRegion = data[i].Region;
        var currentControl = data[i].Control;
        var currentAverage = data[i]['Average Cost'];

        // Check for duplicate control
        if (!set.has(currentControl)) {
            set.add(currentControl);
            controlOption += '<option value="'+ currentControl + '">' + currentControl + '</option>';
        }

        // Check for duplicate region
        if (!duplicatedSet.has(currentRegion)) {
            duplicatedSet.add(currentRegion);
            areaOption += '<option value="'+ currentRegion + '">' + currentRegion + '</option>';
        }
    }

    var admission = {
        "0" : "0.0 - 10%",
        "1" : "10 - 20%",
        "2" : "20 - 30%",
        "3" : "30 - 40%",
        "4" : "40 - 50%",
        "5" : "50 - 60%",
        "6" : "60 - 70%",
        "7" : "70 - 80%",
        "8" : "80 - 90%",
        "9" : "90 - 100%"
    }

    var averageCost = {
        "0" : "0 - $10,000",
        "1" : "10,000 - $20,000",
        "2" : "20,000 - $30,000",
        "3" : "30,000 - $40,000",
        "4" : "40,000 - $50,000",
        "5" : "50,000 - $60,000",
        "6" : "60,000 - $70,000",
        "7" : "70,000 - $80,000",
        "8" : "80,000 - $90,000",
        "9" : "90,000 - $100,000"
    }

    var admissionOption = '<option selected>Choose...</option>';
    var tuitionOption = '<option selected>Choose...</option>';
    for (var key in admission) {
        admissionOption += '<option value="'+ key + '">' + admission[key] + '</option>';
        tuitionOption += '<option value="'+ key + '">' + averageCost[key] + '</option>';
    }

    $('#areasFilter').append(areaOption);
    $('#controlTypeFilter').append(controlOption);
    $('#admissionFilter').append(admissionOption);
    $('#averageFilter').append(tuitionOption);
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

    var chart = d3.select(".rateChart")
        .append("svg")
        .attr("width", WIDTH + configure.left + configure.right)
        .attr("height", HEIGHT + configure.top + configure.bottom)
        .append("g")
        .attr("transform", "translate(" + configure.left + ',' + configure.top + ')')

    // BRUSH
    var brush = chart.append("g")
        .attr("class", "brush");

    chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        // .attr("id", (d, i) => {
        //     return i;
        // })
        .attr("cx", (d) => {
            return xScale(d.TUITION);
        })
        .attr("cy", (d) => {
            return yScale(d.RATE);
        })
        .attr("r", radius)
        .attr('stroke','white')
        .attr("fill", (d, i) => {
            return colorScale(i);
        })
        .on("mouseover", function (d) {
            d3.select(this)
            .transition()
            .duration(800).style("opacity", 1)
            .attr("r", radius * 2).ease("elastic");
        })
        .on("mouseout", function(d) {
            d3.select(this)
            .transition()
            .duration(500)
            .attr("r", radius)
        })
        .on("click", function(d) {
            // TODO
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
})