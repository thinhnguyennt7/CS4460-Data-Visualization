
d3.csv("./P5 Datasets/colleges.csv", (data) => {

    var body = d3.select(".salaryChart");
    var configure = {top: 50, right: 50, bottom: 50, left: 50}
    var HEIGHT = 700;
    var width = d3.select(".salaryChart").style('width').split("px");
    var WIDTH = Math.round(Number(width[0])) - 200;
    var radius = 7;

    var meanEarn = 'Mean Earnings 8 years After Entry';
    var numberOfEmploy = 'Number of Employed 8 years after entry';

    var colorScale = d3.scale.category20()

    for (var i = 0; i < data.length; i++) {
        data[i].MEANEARN = Number(data[i][meanEarn]);
        data[i].NUMEMPLOY = Number(data[i][numberOfEmploy]);
    }

    var meanEarnExtent = d3.extent(data, (d) => {
        return d.MEANEARN;
    })

    var numberOfEmployExtent = d3.extent(data, (d) => {
        return d.NUMEMPLOY;
    })

    var xScale = d3.scale.linear().domain(meanEarnExtent).range([0, WIDTH]).nice();
    var yScale = d3.scale.linear().domain(numberOfEmployExtent).range([HEIGHT, 0]).nice();

    var svg = body.append("svg")
        .attr("height", HEIGHT + configure.top + configure.bottom)
        .attr("width", WIDTH + configure.left + configure.right)
        .append("g")
        .attr("transform", "translate(" + configure.left + ',' + configure.top + ')')

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(15)
        .orient("bottom")
        .tickSize(-HEIGHT)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(20)
        .orient("left")
        .tickSize(-WIDTH)

    // Draw circle
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
            return xScale(d[meanEarn])
        })
        .attr("cy", (d) => {
            return yScale(d[numberOfEmploy])
        })
        // Circle radius
        .attr("r", "" + radius)
        .attr('stroke','black')
        .attr('stroke-width',1)
        .attr('fill',function (d,i) { return colorScale(i) })
        .on('mouseover', function () {
            d3.select(this)
            .transition()
            .duration(800).style("opacity", 1)
            .attr("r", radius * 2 + 4).ease("elastic");
        })
        .on('mouseout', function () {
            d3.select(this)
            .transition()
            .duration(500)
            .attr('r',radius)
            .attr('stroke-width',1)
        })
        .append("title").text((d) => {
            return 'School Name: ' + d.Name + '\nNumber of Employed in 8 years: ' + d[numberOfEmploy] + '\nAverage Earnings after 8 years: ' + d[meanEarn];
        })

        // Title on the x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + HEIGHT + ')')
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", 30)
            .attr("x", WIDTH / 2 + configure.left + configure.left)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Mean Earnings 8 years After Entry")

        // Title on the y-axis
        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .append('text')
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x',-WIDTH / 2 / 2)
            .attr('y',5)
            .attr('dy','.71em')
            .text('Number of Employed 8 years after entry')
});