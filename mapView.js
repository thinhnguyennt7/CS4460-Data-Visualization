d3.csv("./P5 Datasets/colleges.csv", (data) => {
	console.log(data);
	// console.log(data[0].Name)

	var config = { "color1": "#edd790", "color2": "#cc7920", "stateDataColumn": "state_or_territory"};

	// Default values
	var WIDTH = 800, HEIGHT = 500;
	var COLOR_COUNTS = 9;
	var SCALE = 1.0;

	// Determine the color range
	var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;

	// // Color 1 convert to red green blue
	var rgb = hexToRgb(COLOR_FIRST);
	var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

	// // Color 2 convert to red green blue
	rgb = hexToRgb(COLOR_LAST);
	var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

	// var MAP_STATE = config.stateDataColumn;
	var valueById = d3.map();

	// // Interpolate color for the map states
	var startColors = COLOR_START.getColors(),
		endColors = COLOR_END.getColors();
	var colors = [];
	for (var i = 0; i < COLOR_COUNTS; i++) {
		var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
		var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
		var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
		colors.push(new Color(r, g, b));
	}

	// Assign the color to the map
	var quantize = d3.scale.quantize()
		.domain([0, 1.0])
		.range(d3.range(COLOR_COUNTS).map((i) => { return i }));

	var path = d3.geo.path();
	var svg = d3.select("#canvas-svg").append("svg")
		.attr("width", WIDTH)
		.attr("height", HEIGHT);

	// for (var i = 0; i < data.length; i ++) {
	// 	var collegeName = data[i]
	// 	console.log(collegeName);
	// }

	d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", (names) => {

		name_id_map = {};
		id_name_map = {};

		for (var i = 0; i < names.length; i++) {
			name_id_map[names[i].name] = names[i].id;
			id_name_map[names[i].id] = names[i].name;
		}

		// data.forEach((d) => {
		// 	var id = name_id_map[d[MAP_STATE]];
		// 	valueById.set(id, +d[MAP_VALUE]);
		// });

		// quantize.domain([d3.min(data, (d) => { return +d[MAP_VALUE] }),
		// d3.max(data, (d) => { return +d[MAP_VALUE] })]);

		d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", (us) => {
			svg.append("g")
				.attr("class", "states-choropleth")
				.selectAll("path")
				.data(topojson.feature(us, us.objects.states).features)
				.enter().append("path")
				.attr("transform", "scale(" + SCALE + ")")
				.style("fill", (d) => {
					if (valueById.get(d.id)) {
						var i = quantize(valueById.get(d.id));
						var color = colors[i].getColors();
						return "rgb(" + color.r + "," + color.g +
							"," + color.b + ")";
					} else {
						return "";
					}
				})
				.attr("d", path)
				.on("mousemove", (d) => {

					// Container show
					var html = "";
					html += "<div class=\"tooltip_kv\">";
					html += "<span class=\"tooltip_key\">";
					html += id_name_map[d.id];
					html += "</span>";
					html += "<span class=\"tooltip_value\">";
					html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
					html += "";
					html += "</span>";
					html += "</div>";

					// Append to the container show
					$("#schoolDetailView").html(html);
					$("#schoolDetailView").show();

					// Set the location to appear the container
					var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;
					if (d3.event.layerX < map_width / 2) {
						d3.select("#schoolDetailView")
							.style("top", (d3.event.layerY + 15) + "px")
							.style("left", (d3.event.layerX + 15) + "px");
					} else {
						var tooltip_width = $("#schoolDetailView").width();
						d3.select("#schoolDetailView")
							.style("top", (d3.event.layerY + 15) + "px")
							.style("left", (d3.event.layerX - tooltip_width - 30) + "px");
					}
				})
				.on("mouseout", () => {
					$(this).attr("fill-opacity", "1.0");
					$("#schoolDetailView").hide();
				});
			svg.append("path")
				.datum(topojson.mesh(us, us.objects.states, (a, b) => { return a !== b; }))
				.attr("class", "states")
				.attr("transform", "scale(" + SCALE + ")")
				.attr("d", path);
		});
	});
});

d3.csv("./P5 Datasets/colleges.csv", (data) => {
	svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", (d) => {
		var positionDetail = getPositionDetail();
		return projection()
	})
});