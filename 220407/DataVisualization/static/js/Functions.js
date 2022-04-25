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

function analysis(table) {
    AverageIncome(table);
    AboutTT(table);
    Load(table, 0);
}

// 柱状图，每个季度的tt大小
function AverageIncome(table) {
    if (!d3.select("#Histogram").selectAll("svg").empty()) d3.select("#Histogram").selectAll("svg").remove();
    let width = 600;
    let height = 400;
    let svg = d3.select("#Histogram")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    let price = get_table_data(table)[16];
    let Occ = get_table_data(table)[18];
    let Income = new Array();
    let size = Occ.length;
    for (let i = 0; i < size; i++) Income[i] = parseFloat(price[i]) * parseFloat(Occ[i]) / 100;
    let Max = d3.max(Income);
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
    let y_scale = d3.scaleLinear()
        .domain([0, Max])
        .range([height * (14 / 15), (height / 15)]);
    let y_axis = d3.axisLeft()
        .scale(y_scale);
    svg.append("g")
        .attr("class", "y_axis")
        .attr('transform', "translate(" + width / (size + 2) + ", 0)")
        .call(y_axis);

    var tooltip = d3.select("#Histogram")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    var space = document.getElementById('Histogram');
    var Top = space.offsetTop;
    var Left = space.offsetLeft;

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip.style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d, i) {
        tooltip.html("Average Income = " + d)
            .style("left", (d3.mouse(this)[0] + Left + 20) + "px")
            .style("top", (d3.mouse(this)[1] + Top - 20) + "px")
    }
    var mouseleave = function (d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 1)
    }

    // 添加矩形，确定基准点和长宽
    svg.selectAll("rect")
        .data(Income)
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
        .attr("fill", "lightskyblue")
        .on("mousemove", mousemove)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);
    // 添加标题
    let title = "Average income of each month";
    svg.append("text")
        .text(title)
        .style("font-size", "20px")
        .attr("x", width / 3)
        .attr("y", height / 25);
}


// 散点图，横坐标price，纵坐标tt，颜色与convention有关
function AboutTT(table) {
    if (!d3.select("#Points").selectAll("svg").empty()) d3.select("#Points").selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 20, bottom: 40, left: 50},
        width = 520 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Points")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    var legend = d3.select("#Points").select("svg");

    let price = get_table_data(table)[16];
    let Occ = get_table_data(table)[18];
    let Con = get_table_data(table)[19];
    let size = price.length;
    let database = new Array();
    let x_min = 140, x_max = 180;
    let y_min = 50, y_max = 100;
    for (let i = 0; i < size; i++) {
        let data = new Array();
        data[0] = parseInt(price[i]);
        data[1] = parseInt(Occ[i]);
        data[2] = parseInt(Con[i]);
        database[i] = data;
    }

    var x = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, width])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1).ticks(10))
        .select(".domain").remove()

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([height, 0])
        .nice()
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(-width * 1).ticks(7))
        .select(".domain").remove()

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 20)
        .text("Price");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height / 2 + 20)
        .text("Occupancy(%)")

    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#F8766D", "#00BA38"])
    console.log(database);

    // create a tooltip
    var tooltip = d3.select("#Points")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    var space = document.getElementById('Points');
    var Top = space.offsetTop;
    var Left = space.offsetLeft;

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip.style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d, i) {
        tooltip.html("Month " + (i + 1))
            .style("left", (d3.mouse(this)[0] + Left + 70) + "px")
            .style("top", (d3.mouse(this)[1] + Top) + "px")
    }
    var mouseleave = function (d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 1)
    }
    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(database)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d[0]);
        })
        .attr("cy", function (d) {
            return y(d[1]);
        })
        .attr("r", 5)
        .style("fill", function (d) {
            return color(d[2])
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    legend.append("rect")
        .attr("x", margin.left)
        .attr("y", 0)
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", "#F8766D");
    legend.append("text")
        .text("No Convention")
        .attr("y", margin.top / 2)
        .attr("x", margin.left + 30)
        .style("font-size", 15)

    legend.append("rect")
        .attr("x", margin.left + 200)
        .attr("y", 0)
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", "#00BA38");
    legend.append("text")
        .text("With Convention")
        .attr("y", margin.top / 2)
        .attr("x", margin.left + 230)
        .style("font-size", 15)
}

// 堆积柱状图，每个月的来源、性别、年龄、目的分布
function Load(table, kind) {
    if (!d3.select("#LoadedBar").selectAll("svg").empty()) d3.select("#LoadedBar").selectAll("svg").remove();
    let local = get_table_data(table)[1];
    let USA = get_table_data(table)[2];
    let SA = get_table_data(table)[3];
    let EU = get_table_data(table)[4];
    let MEA = get_table_data(table)[5];
    let ASIA = get_table_data(table)[6];
    let businessmen = get_table_data(table)[7];
    let tourists = get_table_data(table)[8];
    let kid = get_table_data(table)[12];
    let teenager = get_table_data(table)[13];
    let mid = get_table_data(table)[14];
    let old = get_table_data(table)[15];
    let size = local.length;
    let data = new Array();
    if (kind == 0) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['local'] = parseInt(local[i]);
            cur['USA'] = parseInt(USA[i]);
            cur['SA'] = parseInt(SA[i]);
            cur['EU'] = parseInt(EU[i]);
            cur['MEA'] = parseInt(MEA[i]);
            cur['ASIA'] = parseInt(ASIA[i]);
            data[i] = cur;
        }
    }
    else if (kind == 1) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['businessmen'] = parseInt(businessmen[i]);
            cur['tourists'] = parseInt(tourists[i]);
            data[i] = cur;
        }
    }
    else if (kind == 2) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['u20'] = parseInt(kid[i]);
            cur['20to35'] = parseInt(teenager[i]);
            cur['35to55'] = parseInt(mid[i]);
            cur['m55'] = parseInt(old[i]);
            data[i] = cur;
        }
    }
    console.log(data);
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 100, bottom: 20, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var space = document.getElementById('LoadedBar');
    var Top = space.offsetTop;
    var Left = space.offsetLeft;
    // append the svg object to the body of the page
    var svg = d3.select("#LoadedBar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = [];
    if(kind == 0) subgroups = ["local", "USA", "SA", "EU", "MEA", "ASIA"];
    else if(kind == 1) subgroups = ["businessmen", "tourists"];
    else if(kind == 2) subgroups = ["u20", "20to35", "35to55", "m55"];

    var groups = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5])
        .range(['#e41a1c', '#377eb8', '#4daf4a',
            '#ecc60a', "#460aec", "#dd0aec"])

    // Normalize the data -> sum of each group must be 100!
    let dataNormalized = []
    data.forEach(function (d) {
        // Compute the total
        let tot = 0
        for (let i in subgroups) {
            let name = subgroups[i];
            tot += d[name]
        }
        // Now normalize
        for (let i in subgroups) {
            let name = subgroups[i];
            d[name] = d[name] / tot * 100
        }
    })

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)(data)
    for (let i = 0; i < stackedData.length; i++) {
        for (let j = 0; j < stackedData[i].length; j++) {
            stackedData[i][j][2] = i;
        }
    }
    console.log(stackedData);

    // create a tooltip
    var tooltip = d3.select("#LoadedBar")
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
    var mousemove = function (d, i) {
        tooltip.html("Real percentage of " + subgroups[d[2]] + " in " + groups[i] + " is " + (d[1] - d[0]) + "%")
            .style("left", (d3.mouse(this)[0] + Left + 70) + "px")
            .style("top", (d3.mouse(this)[1] + Top) + "px")
    }
    var mouseleave = function (d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 1)
    }

    // Show the bars
    svg.append("g").selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) {
            return color(d[2]);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d, i) {
            return x(groups[i]);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .on("click", function (d) {
            WithLoad(stackedData, d[2], subgroups[d[2]]);
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    let legend = d3.select("#LoadedBar").select("svg").append("g")
        .attr("transform", "translate(" + (width + margin.left) + "," + (margin.top) + ")")
        .selectAll("g")
        .data(subgroups)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return `translate(10, ${i * height / 10})`
        });

    legend.append("rect")
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", function (d, i) {
            return color(i);
        });

    legend.append("text")
        .text(function (d) {
            return d
        })
        .style("font-size", 13)
        .attr("y", "1em")
        .attr("x", "3em")
        .attr("dy", 3)

    let cur_text = "Percentage Distribution of ";
    if(kind == 0) cur_text += "Source";
    else if(kind == 1) cur_text += "Purpose";
    else if(kind == 2) cur_text += "Age";
    d3.select("#LoadedBar").select("svg")
        .append("text")
        .text(cur_text)
        .style("font-size", "1vw")
        .attr("x", (width + margin.left + margin.right) / 2.5)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", height / 20);

    var Switch = d3.select("#LoadedBar").selectAll("svg")
        .append("g")
        .attr("transform", "translate(" + (width + margin.left + 10) + "," + (margin.top + height * 0.8) + ")");

    Switch.append("rect")
        .attr("y", 0)
        .attr("x", 0)
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", '#ffd400')
        .on("click", function() {
            tooltip.style("opacity", 0);
            Load(table, 0);
        })
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("mousemove", function () {
            tooltip.html("Swtich to Region")
                .style("left", (d3.mouse(this)[0] + Left + 50 + (width + margin.left)) + "px")
                .style("top", (d3.mouse(this)[1] + Top) + (margin.top + height * 0.8) - 10 + "px")
        });
    Switch.append("text")
        .text("Region")
        .style("font-size", 13)
        .attr("y", 15)
        .attr("x", 40);
    Switch.append("rect")
        .attr("y", 20)
        .attr("x", 0)
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", '#0055ff')
        .on("click", function() {
            tooltip.style("opacity", 0);
            Load(table, 1);
        })
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("mousemove", function () {
            tooltip.html("Swtich to Purpose")
                .style("left", (d3.mouse(this)[0] + Left + 50 + (width + margin.left)) + "px")
                .style("top", (d3.mouse(this)[1] + Top) + (margin.top + height * 0.8) - 10 + "px")        });
    Switch.append("text")
        .text("Purpose")
        .style("font-size", 13)
        .attr("y", 35)
        .attr("x", 40);
    Switch.append("rect")
        .attr("y", 40)
        .attr("x", 0)
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", '#31ff03')
        .on("click", function() {
            tooltip.style("opacity", 0);
            Load(table, 2);
        })
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("mousemove", function () {
            tooltip.html("Swtich to Age")
                .style("left", (d3.mouse(this)[0] + Left + 50 + (width + margin.left)) + "px")
                .style("top", (d3.mouse(this)[1] + Top) + (margin.top + height * 0.8) - 10 + "px")
        });
    Switch.append("text")
        .text("Age")
        .style("font-size", 13)
        .attr("y", 55)
        .attr("x", 40);
}

// 在点击特定项的时候显示对应的分布信息
function WithLoad(stackedData, id, name) {
    if (!d3.select("#Lines").selectAll("svg").empty()) d3.select("#Lines").selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Lines")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var data = new Array();
    for (let i = 0; i < 12; i++) data[i] = stackedData[id][i][1] - stackedData[id][i][0];

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 12])
        .range([0, width]);
    let x_axis = d3.axisBottom()
        .scale(x);
    svg.append("g")
        .attr('transform', "translate(0," + height + ")")
        .call(x_axis);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d, i) {
                return x(i + 1);
            })
            .y(function (d) {
                return y(d)
            })
        )
    var space = document.getElementById('Lines');
    var Top = space.offsetTop;
    var Left = space.offsetLeft;
    // create a tooltip
    var tooltip = d3.select("#LoadedBar")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    var mouseover = function (d) {
        tooltip.style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 0.8)
    }
    var mousemove = function (d) {
        tooltip.html(d)
            .style("left", (d3.mouse(this)[0] + Left + 70) + "px")
            .style("top", (d3.mouse(this)[1] + Top) + "px")
    }
    var mouseleave = function (d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "red")
            .style("opacity", 1)
    }
    // 添加圆点，用白色填充
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return x(i + 1);
        })
        .attr("cy", function (d) {
            return y(d)
        })
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    let cur_text = "Percentage Distribution of Source";
    d3.select("#Lines").select("svg")
        .append("text")
        .text(name)
        .style("font-size", "1vw")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", height / 20);
}