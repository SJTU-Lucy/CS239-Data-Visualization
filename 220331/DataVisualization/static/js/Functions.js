function table_init(table) {
    var initLen;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_hotel_info", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    xhr.send(JSON.stringify({
        "None": 1
    }))
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            initLen = JSON.parse(xhr.responseText).female.length;
            let female = JSON.parse(xhr.responseText).female;
            let local = JSON.parse(xhr.responseText).local;
            let USA = JSON.parse(xhr.responseText).USA;
            let SA = JSON.parse(xhr.responseText).SA;
            let EU = JSON.parse(xhr.responseText).EU;
            let MEA = JSON.parse(xhr.responseText).MEA;
            let ASIA = JSON.parse(xhr.responseText).ASIA;
            let businessmen = JSON.parse(xhr.responseText).businessmen;
            let tourists = JSON.parse(xhr.responseText).tourists;
            let DR = JSON.parse(xhr.responseText).DR;
            let agency = JSON.parse(xhr.responseText).agency;
            let AC = JSON.parse(xhr.responseText).AC;
            let u20 = JSON.parse(xhr.responseText).u20;
            let _20to35 = JSON.parse(xhr.responseText)._20to35;
            let _35to55 = JSON.parse(xhr.responseText)._35to55;
            let m55 = JSON.parse(xhr.responseText).m55;
            let price = JSON.parse(xhr.responseText).price;
            let LoS = JSON.parse(xhr.responseText).LoS;
            let occupancy = JSON.parse(xhr.responseText).occupancy;
            let conventions = JSON.parse(xhr.responseText).conventions;
            let tArray = [];
            for (let i = 0; i < initLen; i++) {
                tArray[i] = [];
                tArray[i][0] = female[i]
                tArray[i][1] = local[i]
                tArray[i][2] = USA[i]
                tArray[i][3] = SA[i]
                tArray[i][4] = EU[i]
                tArray[i][5] = MEA[i]
                tArray[i][6] = ASIA[i]
                tArray[i][7] = businessmen[i]
                tArray[i][8] = tourists[i]
                tArray[i][9] = DR[i]
                tArray[i][10] = agency[i]
                tArray[i][11] = AC[i]
                tArray[i][12] = u20[i]
                tArray[i][13] = _20to35[i]
                tArray[i][14] = _35to55[i]
                tArray[i][15] = m55[i]
                tArray[i][16] = price[i]
                tArray[i][17] = LoS[i]
                tArray[i][18] = occupancy[i]
                tArray[i][19] = conventions[i]
            }
            let row = table.rows[1];
            for (let i = 1; i < row.cells.length; i++) {
                row.cells[i].innerHTML = tArray[0][i - 1];
            }
            for (let i = 1; i < initLen; i++) {
                add_row(table, tArray[i]);
            }
        }
    }
}

function update_hotel_info(table) {
    let ret = get_table_data(table);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_hotel_info", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    xhr.send(JSON.stringify({
        "female": ret[0],
        "local": ret[1],
        "USA": ret[2],
        "SA": ret[3],
        "EU": ret[4],
        "MEA": ret[5],
        "ASIA": ret[6],
        "businessmen": ret[7],
        "tourists": ret[8],
        "DR": ret[9],
        "agency": ret[10],
        "AC": ret[11],
        "u20": ret[12],
        "_20to35": ret[13],
        "_35to55": ret[14],
        "m55": ret[15],
        "price": ret[16],
        "LoS": ret[17],
        "occupancy": ret[18],
        "conventions": ret[19]
    }))
}


function get_table_data(table) {
    let ret = [];
    for (let j = 1; j < table.getElementsByTagName("tr")[0].cells.length; j++) {
        ret[j - 1] = [];
    }
    for (let i = 1; i < table.getElementsByTagName("tr").length; i++) {
        for (let j = 1; j < table.getElementsByTagName("tr")[i].cells.length; j++) {
            ret[j - 1][i - 1] = table.getElementsByTagName("tr")[i].cells[j].innerHTML;
        }
    }
    return ret;
}

function add_row(table, infoRow) {
    let row = document.getElementById("backup").cloneNode(true);
    if (infoRow != null) {
        for (let i = 1; i < row.cells.length; i++) {
            row.cells[i].innerHTML = infoRow[i - 1];
        }
    } else {
        for (let i = 1; i < row.cells.length; i++) {
            row.cells[i].innerHTML = "";
        }
    }
    table.tBodies[0].appendChild(row);
    return row;
}

function delete_row(table, row) {
    for (let i = table.rows.length - 1; i > 0; i--) {
        let chkOrder = table.rows[i].cells[0].firstChild;
        if (chkOrder && chkOrder.type === "checkbox" && chkOrder.checked) {
            table.deleteRow(i);
        }
    }
}

// 维护按动状态
let column_index = 0;
let down = 0;

// 如果按动新的，先取消原本的再按，否则直接按
function touch(table, index) {
    if (index != column_index) {
        down = 1;
        unchoose(table, column_index);
        choose(table, index);
    } else {
        down = 1 - down;
        if (down == 1) choose(table, index);
        else unchoose(table, index);
    }
}

// 选中列改变背景颜色，并作图
function choose(table, index) {
    column_index = index;
    let unit = table.rows[0].cells[index];
    unit.style.backgroundColor = "grey";
    charts(table);
}

// 取消选中，回归背景色，并清除原图像
function unchoose(table, index) {
    let unit = table.rows[0].cells[index];
    unit.style.backgroundColor = "whitesmoke";
    d3.select("#Former").selectAll("svg").remove();
}

// 画柱状图
function charts(table) {
    if (!d3.select("#Histogram").selectAll("svg").empty()) d3.select("#Histogram").selectAll("svg").remove();
    let width = 600;
    let height = 400;
    let svg = d3.select("#Histogram")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    let dataset = get_table_data(table)[column_index - 1];
    let size = dataset.length;
    for (let i = 0; i < size; i++) dataset[i] = parseFloat(dataset[i]);
    let Max = d3.max(dataset);
    // x坐标轴，左右分别留有余量
    let x_scale = d3.scaleLinear()
        .domain([0, size])
        .range([(width / (size + 2)), width - (width / (size + 2))]);
    let x_axis = d3.axisBottom()
        .scale(x_scale);
    svg.append("g")
        .attr("class", "x_axis")
        .attr('transform', "translate(0," + 14 * height / 15 + ")")
        .call(x_axis);
    // y坐标轴，上下留有余量，注意反转
    let y_scale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([height * (14 / 15), (height / 15)]);
    let y_axis = d3.axisLeft()
        .scale(y_scale);
    svg.append("g")
        .attr("class", "y_axis")
        .attr('transform', "translate(" + width / (size + 2) + ", 0)")
        .call(y_axis);
    // 添加矩形，确定基准点和长宽
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return (i + 1.6) * (width / (size + 2));
        })
        .attr("y", function (d) {
            return (14 / 15) * height - (d / Max) * (13 / 15) * height;
        })
        .attr("width", 0.8 * (width / (size + 2)))
        .attr("height", function (d) {
            return (d / Max) * (13 / 15) * height;
        })
        .attr("fill", "lightskyblue");

    // 添加折线，使用相邻点数据确定位置
    for (let i = 0; i < size - 1; i++) {
        let x1 = (i + 2) * (width / (size + 2));
        let x2 = (i + 3) * (width / (size + 2));
        let y1 = ((14 / 15) * height - (dataset[i] / Max) * (13 / 15) * height);
        let y2 = ((14 / 15) * height - (dataset[i + 1] / Max) * (13 / 15) * height);
        svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "mediumpurple")
            .attr("stroke-width", 3);
    }
    // 添加圆点，用白色填充
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return (i + 2) * (width / (size + 2));
        })
        .attr("cy", function (d) {
            return ((14 / 15) * height - (d / Max) * (13 / 15) * height);
        })
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5);
    // 添加标题
    let title = table.rows[0].cells[column_index].innerHTML;
    svg.append("text")
        .text(title)
        .style("font-size", "20px")
        .attr("x", width / 2)
        .attr("y", height / 25);
}

function parallel(table) {
    if (!d3.select("#Parallel").selectAll("svg").empty()) d3.select("#Parallel").selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 20, bottom: 10, left: 20},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Parallel")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scaleOrdinal()
                .domain([1, 12])
                .range(["#37a2da", "#0bfcfc", "#1fd021", "#9aad2e",
                    "#fcf011", "#ff9f7f", "#b614db", "#ac7c7c",
                    "#e690d1", "#325c59", "#9d96f5", "#f44242"]);

    // Parse the Data
    d3.csv("static/data/padata.csv", function (data) {
        // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
        dimensions = d3.keys(data[0]);
        // For each dimension, I build a linear scale. I store all in a y object
        var y = {}
        for (i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return +d[name];
                }))
                .range([height, 0])
        }

        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function (p) {
                return [x(p), y[p](d[p])];
            }));
        }

        // Draw the lines
        svg.selectAll("myPath")
            .data(data)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function(d){ return( color(d.Month))} )
            .style("opacity", 0.5)

        // Draw the axis:
        svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            })
            // And I build the axis with the call function
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(y[d]));
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black")
    })
    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Parallel Demonstration");
}

function piechart(table) {
    if (!d3.select("#PieChart").selectAll("svg").empty()) d3.select("#PieChart").selectAll("svg").remove();
    var width = 600;
    var height = 400;
    var margin = 30;
    var radius = Math.min(width, height) / 2 - margin;
    var svg = d3.select("#PieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + Math.min(width, height) / 2 + "," + Math.min(width, height) / 2 + ")");

    var data = {"Local": 0, "USA": 0, "SA": 0, "EU": 0, "MEA": 0, "ASIA": 0};
    let dataset_type_name = ["Local", "USA", "SA", "EU", "MEA", "ASIA"];

    let ori_dataset = get_table_data(table);
    let dataset = [];

    for (let i = 0; i < 6; i++) {
        dataset[i] = [];
        for (let j = 0; j < ori_dataset[i + 1].length; j++) {
            dataset[i][j] = ori_dataset[i + 1][j];
            if (dataset[i][j] !== "") dataset[i][j] = parseFloat(dataset[i][j]);
            else dataset[i][j] = 0;
        }
    }
    var chosen = 0;
    for (let i = 1; i < table.rows.length; i++) {
        let chk_order = table.rows[i].cells[0].firstChild;
        if (chk_order && chk_order.type === "checkbox" && chk_order.checked) {
            chosen = i - 1;
            break;
        }
    }
    if(chosen == 0) {
        alert("Please choose a valid row!");
        return;
    }
    for (let i = 0; i < 6; i++) data[dataset_type_name[i]] = dataset[i][chosen];

    var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeSet2);

    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        })
    var data_ready = pie(d3.entries(data))

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d) {
            return (color(d.data.key))
        })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) {
            return d.data.value
        })
        .attr("transform", function (d) {
            return "translate(" + arcGenerator.centroid(d)[0] * 1.5 + "," + arcGenerator.centroid(d)[1] * 1.5 + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 20)

    let legend = d3.select("#PieChart").select("svg").append("g")
        .attr("transform", "translate(" + 3 * width / 5 + "," + height / 4 + ")")
        .selectAll("g")
        .data(data_ready)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return `translate(${width / 10}, ${i * height / 10})`
        });

    legend.append("rect")
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", function (d) {
            return color(d.data.key)
        });

    legend.append("text")
        .text(function (d) {
            return d.data.key
        })
        .style("font-size", 13)
        .attr("y", "1em")
        .attr("x", "3em")
        .attr("dy", 3)
    let month = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];
    let cur_text = "Guests Sources Distribution in " + month[chosen];
    d3.select("#PieChart").select("svg")
        .append("text")
        .text(cur_text)
        .style("font-size", "1vw")
        .attr("x", width / 2.5)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", height / 20);
}

function heatmap(table, space) {
    if (!d3.select("#HeatMap").selectAll("svg").empty()) d3.select("#HeatMap").selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 60, right: 25, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
    var Top = space.offsetTop;
    var Left = space.offsetLeft;

    // append the svg object to the body of the page
    var svg = d3.select("#HeatMap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("static/data/hmdata.csv", function (data) {
        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var myGroups = d3.map(data, function (d) {
            return d.group;
        }).keys()
        var myVars = d3.map(data, function (d) {
            return d.variable;
        }).keys()

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain(myGroups)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 12)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain(myVars)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1, 100])

        // create a tooltip
        var tooltip = d3.select("#HeatMap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip.style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip.html("The exact value of<br>this cell is: " + d.value)
                .style("left", (d3.mouse(this)[0] + 70 + Left) + "px")
                .style("top", (d3.mouse(this)[1] + Top) + "px")
        }
        var mouseleave = function (d) {
            tooltip.style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg.selectAll()
            .data(data, function (d) {
                return d.group + ':' + d.variable;
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.group)
            })
            .attr("y", function (d) {
                return y(d.variable)
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                return myColor(d.value)
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })

    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("HeatMap Demonstration");
}