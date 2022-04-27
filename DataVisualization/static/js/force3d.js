let N = 14
var data = {
    nodes: [],
    links: []
};

const gData = {
    nodes: [...Array(N).keys()].map(i => ({id: i})),
    links: [...Array(N).keys()]
        .filter(id => id)
        .map(id => ({
            source: id,
            target: Math.round(Math.random() * (id - 1))
        }))
};

var idDir = {};

function node_init() {
    var initLen;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/get_node_info", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    xhr.send(JSON.stringify({
        "None": 1
    }))
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            initLen = JSON.parse(xhr.responseText).id.length;
            let id = JSON.parse(xhr.responseText).id;
            let name = JSON.parse(xhr.responseText).name;
            for (let i = 0; i < initLen; i++) {
                data['nodes'][i] = {};
                idDir[id[i]] = i;
                data['nodes'][i]['id'] = i;
                data['nodes'][i]['name'] = name[i];
                data['nodes'][i]['val'] = 1;
            }
        }
    }
}

function link_init() {
    var initLen;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/get_link_info", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    xhr.send(JSON.stringify({
        "None": 1
    }))
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            initLen = JSON.parse(xhr.responseText).source.length;
            let source = JSON.parse(xhr.responseText).source;
            let target = JSON.parse(xhr.responseText).target;
            for (let i = 0; i < initLen; i++) {
                data['links'][i] = {};
                data['links'][i]['source'] = idDir[source[i]];
                data['links'][i]['target'] = idDir[target[i]];
            }
        }
    }
}

async function Force3D() {
    await node_init();
    await link_init();
    console.log(Array(N).keys());
    console.log(data);
    console.log(gData);
    const Graph = ForceGraph3D()(document.getElementById('3d-graph')).graphData(gData);
}