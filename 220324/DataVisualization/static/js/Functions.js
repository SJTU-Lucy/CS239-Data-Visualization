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
    d3.select("body").selectAll("svg").remove();
}

// 画柱状图
function charts(table) {
    let width = 600;
    let height = 400;
    let svg = d3.select("body")
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
        .attr('transform', "translate(0," +  14 * height / 15 + ")")
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
        .attr("x", function (d, i) {return (i + 1.6) * (width / (size + 2));})
        .attr("y", function (d) {return (14 / 15) * height - (d / Max) * (13 / 15) * height;})
        .attr("width", 0.8 * (width / (size + 2)))
        .attr("height", function (d) {return (d / Max) * (13 / 15) * height;})
        .attr("fill", "lightskyblue");

    // 添加折线，使用相邻点数据确定位置
    for (let i = 0; i < size - 1; i++) {
        let x1 = (i + 2) * (width / (size + 2));
        let x2 = (i + 3) * (width / (size + 2));
        let y1 = ((14 / 15) * height - (dataset[i] / Max) * (13 / 15) * height);
        let y2 = ((14 / 15) * height - (dataset[i+1] / Max) * (13 / 15) * height);
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
        .attr("cx", function (d, i) {return (i + 2) * (width / (size + 2));})
        .attr("cy", function (d) {return ((14 / 15) * height - (d / Max) * (13 / 15) * height);})
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