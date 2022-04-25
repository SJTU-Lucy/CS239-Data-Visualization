# Assignment 7

​		本次作业内容为绘制histogram,  heatmap, radar,  parallel,  pie chart中的三种，选择heatmap, parallel和pie chart。

## HeatMap

​		热力图可以直白反映数据分布，快速看出数据峰值位置，直接使用热力图表达给定数据的分布。在热力图的模板中，输入数据格式与给定数据不同，每一条数据包含两轴上的位置，以及值大小，因此需要对提供表格进行预处理。

​		实现效果如下图所示，深色表示小数据，浅色表达表示大数据，并且当鼠标停留在某一格上时，会给对应格添加黑边，并且悬浮显示实际数据大小。

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src=C:\Users\18158\AppData\Roaming\Typora\typora-user-images\image-20220402103210731.png>
    <br>
    <div style="color:orange;
    display: inline-block;
    color: black;
    padding: 5px;">热力图样例</div>
</center>
## Parallel

​		Parallel图将同一系列中的不同数据项用折线的形式显示，并且坐标轴互相独立，可以表现不同项之间的对应关系。在parallel模板中，输入数据与给定数据略有不同，只需要添加一列表示月份的项，即可表示。

​		实现效果如下图所示，为直观显示对应关系，对不同月份的折线使用不同的颜色进行映射。

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src=C:\Users\18158\AppData\Roaming\Typora\typora-user-images\image-20220402104953633.png>
    <br>
    <div style="color:orange;
    display: inline-block;
    color: black;
    padding: 5px;">Parallel样例</div>
</center>
## Pie Chart

​		饼图可以用于表示数据的分布状况，在本例中，可以用于表示每一月份的游客年龄、职业分布情况。在实现中需要获取选中的月份，可以使用与此前删除数据相似的方式，检查勾选框是否被选中即可。

​		实现效果如下图所示，对于选中的不同月份，获得不同的结果。若同时选中多个月份，则只画出选择最小月的。由于饼图中空间不足以显示详细信息，因此将图例独立表示。

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src=C:\Users\18158\AppData\Roaming\Typora\typora-user-images\image-20220402105940393.png>
    <br>
    <div style="color:orange;
    display: inline-block;
    color: black;
    padding: 5px;">饼图样例</div>
</center>
