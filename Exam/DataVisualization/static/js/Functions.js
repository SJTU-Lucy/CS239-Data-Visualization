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

var chosen = -1;
var subgroups = [];
var idlist = ["area", "group", "reservation", "age", "gender", "occupancy"];

function choose(table, index) {
    chosen = index;
    if (index == 0) subgroups = ["local", "USA", "SA", "EU", "MEA", "ASIA"];
    if (index == 1) subgroups = ["businessmen", "tourists"];
    if (index == 2) subgroups = ["DR", "Agency", "AC"];
    if (index == 3) subgroups = ["u20", "20to35", "35to55", "m55"];
    if (index == 4) subgroups = ["female", "male"];
    if (index == 5) subgroups = ["Occupied", "Not Occupied"];
    for (let i = 0; i < 6; i++) document.getElementById(idlist[i]).style.background = "lightgreen";
    document.getElementById(idlist[index]).style.background = "green";
    Load(table, index);
}

// 0: Area; 1: Group; 2: Reservation; 3: Client's age; 4: Gender; 5: Occupancy
function Load(table, kind) {
    if (!d3.select("#LoadedBar").selectAll("svg").empty()) d3.select("#LoadedBar").selectAll("svg").remove();
    // 0 = Area
    let local = get_table_data(table)[1];
    let USA = get_table_data(table)[2];
    let SA = get_table_data(table)[3];
    let EU = get_table_data(table)[4];
    let MEA = get_table_data(table)[5];
    let ASIA = get_table_data(table)[6];
    // 1 = Group
    let businessmen = get_table_data(table)[7];
    let tourists = get_table_data(table)[8];
    // 2 = Reservation
    let DR = get_table_data(table)[9];
    let agency = get_table_data(table)[10];
    let AC = get_table_data(table)[11];
    // 3 = Age
    let kid = get_table_data(table)[12];
    let teenager = get_table_data(table)[13];
    let mid = get_table_data(table)[14];
    let old = get_table_data(table)[15];
    // 4 = Gender
    let female = get_table_data(table)[0];
    // 5 = Occupancy
    let Occupancy = get_table_data(table)[18];

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
    } else if (kind == 1) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['businessmen'] = parseInt(businessmen[i]);
            cur['tourists'] = parseInt(tourists[i]);
            data[i] = cur;
        }
    } else if (kind == 2) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['DR'] = parseInt(DR[i]);
            cur['Agency'] = parseInt(agency[i]);
            cur['AC'] = parseInt(AC[i]);
            data[i] = cur;
        }
    } else if (kind == 3) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['u20'] = parseInt(kid[i]);
            cur['20to35'] = parseInt(teenager[i]);
            cur['35to55'] = parseInt(mid[i]);
            cur['m55'] = parseInt(old[i]);
            data[i] = cur;
        }
    } else if (kind == 4) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['female'] = parseInt(female[i]);
            cur['male'] = 100 - parseInt(female[i]);
            data[i] = cur;
        }
    } else if (kind == 5) {
        for (let i = 0; i < size; i++) {
            let cur = {};
            cur['Occupied'] = parseInt(Occupancy[i]);
            cur['Not Occupied'] = 100 - parseInt(Occupancy[i]);
            data[i] = cur;
        }
    }
    console.log(data);
    // set the dimensions and margins of the graph
    //var margin = {top: 50, right: 150, bottom: 20, left: 50},
    //    width = 600 - margin.left - margin.right,
    //    height = 400 - margin.top - margin.bottom;
    var Width = document.body.clientWidth * 0.55;
    var Height = Width * 2 / 3;
    var margin = {top: Width / 12, right: Width / 4, bottom: Width / 30, left: Width / 12}
    let width = Width - margin.left - margin.right;
    let height = Height - margin.top - margin.bottom;
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

    var groups = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
        .attr("width", width / 30)
        .attr("height", height / 30)
        .attr("fill", function (d, i) {
            return color(i);
        });

    legend.append("text")
        .text(function (d) {
            return d
        })
        .style("font-size", Width / 80)
        .attr("y", "1em")
        .attr("x", "3em")
        .attr("dy", 3)

    let cur_text = "Percentage Distribution of ";
    if (kind == 0) cur_text += "Area";
    if (kind == 1) cur_text += "Group";
    if (kind == 2) cur_text += "Reservation";
    if (kind == 3) cur_text += "Age";
    if (kind == 4) cur_text += "Gender";
    if (kind == 5) cur_text += "Occupancy";

    d3.select("#LoadedBar").select("svg")
        .append("text")
        .text(cur_text)
        .style("font-size", Width / 50)
        .attr("x", (width + margin.left + margin.right) / 2.5)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", height / 20);
}


function charts(table) {
    var chart = document.getElementById("Echart");
    var myChart = echarts.init(chart);
    window.onresize = function () {
        myChart.resize();
        if(chosen!=-1) Load(table, chosen);
    }
    const months = [
        '1', '2', '3', '4', '5', '6',
        '7', '8', '9', '10', '11', '12'
    ];
    const kinds = [
        'female', 'local', 'USA', 'SA', 'EU', 'MEA', 'ASIA', 'businessmen',
        'tourists', 'DR', 'agency', 'AC', 'u20', '20to35', '35to55', 'm55',
        'price', 'LoS', 'occupancy', 'conventions'
    ];
    let raw_data = new Array();
    let dataset = new Array();
    let count = 0;
    for (let i = 0; i < 20; i++) {
        let Min = 1000;
        let Max = 0;
        let x = get_table_data(table)[i];
        raw_data[i] = x;
        for (let j = 0; j < 12; j++) {
            x[j] = parseFloat(x[j]);
            if (x[j] < Min) Min = x[j];
            if (x[j] > Max) Max = x[j];
        }
        for (let j = 0; j < 12; j++) {
            let tmp = new Array();
            tmp[0] = j;
            tmp[1] = i;
            tmp[2] = (x[j] - Min) / (Max - Min) * 8 + 0.5;
            dataset[count] = tmp;
            count++;
        }
    }
    console.log(dataset);
    option = {
        title: {
            text: 'Bubble map of data distribution'
        },
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return (
                    raw_data[params.value[1]][params.value[0]] +
                    ' for ' +
                    kinds[params.value[1]] +
                    ' in month = ' +
                    months[params.value[0]]
                );
            }
        },
        grid: {
            left: 2,
            bottom: 10,
            right: 10,
            containLabel: true
        },
        watch: {
            "item.width"() {
                this.barChart.resize({
                    width: this.item.width,
                    height: this.item.height,
                });
            },
            "item.height"() {
                this.barChart.resize({
                    width: this.item.width,
                    height: this.item.height,
                });
            }
        },
        xAxis: {
            type: 'category',
            data: months,
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: kinds,
            axisLine: {
                show: false
            },
            splitLine: {
                show: true
            }
        },
        series: [
            {
                name: 'Punch Card',
                type: 'scatter',
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                data: dataset,
                animationDelay: function (idx) {
                    return idx * 5;
                }
            }
        ]
    };
    myChart.setOption(option);
}