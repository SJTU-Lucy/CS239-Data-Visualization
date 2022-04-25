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
    var myChart = echarts.init(document.getElementById('main'));
    myChart.clear();
    var option = {};
    myChart.setOption(option);
}

function charts(table) {
    var myChart = echarts.init(document.getElementById('main'));
    let y_data = get_table_data(table)[column_index - 1];
    let x_data = [];
    let Max = 0;
    for (let i = 1; i <= y_data.length; i++) x_data[i-1] = i;
    for (let i = 0; i < y_data.length; i++) {
        if (y_data[i] !== "") y_data[i] = parseFloat(y_data[i]);
        else y_data[i] = 0;
        if(y_data[i]>Max) Max = y_data[i];
    }
    let chart_title = table.rows[0].cells[column_index].innerHTML;
    var option = {
        title: {
            text: chart_title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: [
            {
                type: 'category',
                data: x_data,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                max: Max
            }
        ],
        series: [
            {
                type: 'bar',
                data: y_data
            },
            {
                type: 'line',
                data: y_data
            }
        ]
    };
    myChart.setOption(option);
}