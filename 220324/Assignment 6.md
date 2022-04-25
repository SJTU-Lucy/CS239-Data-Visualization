# Assignment 6

​		本次内容基本与Assignment 5相同，只是在作图的方式上，从直接调用echarts库，到使用d3自行添加图形元素。为绘制柱状图与折线图结合的图样，需要添加坐标轴、矩形、圆、以及直线元素。绘图效果如下：

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src=C:\Users\18158\AppData\Roaming\Typora\typora-user-images\image-20220324215929375.png>
    <br>
    <div style="color:orange;
    display: inline-block;
    color: black;
    padding: 5px;">绘图样例</div>
</center>

​	主要难点在于不能直接将svg的视窗尺寸作为基准点添加元素，否则坐标轴的标注将无法放入。考虑在长宽中各取出一定比例的空间作为添加空间，因此坐标需要进行转换。


```js
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
```

