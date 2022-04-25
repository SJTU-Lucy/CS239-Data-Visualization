function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
}

function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
}

function getNeighbors(node, links) {
    return links.reduce(
        (neighbors, link) => {
            if (link.target.id === node.id) {
                neighbors.push(link.source.id)
            } else if (link.source.id === node.id) {
                neighbors.push(link.target.id)
            }
            return neighbors
        },
        [node.id]
    )
}

function getNodeColor(node, neighbors) {
    if (neighbors.indexOf(node.id)) {
        return node.level === 1 ? 'blue' : 'green'
    }
    return node.level === 1 ? 'red' : 'gray'
}


function getTextColor(node, neighbors) {
    return neighbors.indexOf(node.id) ? 'green' : 'black'
}

var baseNodes = [];
var baseLinks = [];
var nodes = [];
var links = [];

/*
var baseNodes = [
    {id: "mammal", group: 0, label: "Mammals", level: 1},
    {id: "dog", group: 0, label: "Dogs", level: 2},
    {id: "cat", group: 0, label: "Cats", level: 2},
    {id: "fox", group: 0, label: "Foxes", level: 2},
    {id: "elk", group: 0, label: "Elk", level: 2},
    {id: "insect", group: 1, label: "Insects", level: 1},
    {id: "ant", group: 1, label: "Ants", level: 2},
    {id: "bee", group: 1, label: "Bees", level: 2},
    {id: "fish", group: 2, label: "Fish", level: 1},
    {id: "carp", group: 2, label: "Carp", level: 2},
    {id: "pike", group: 2, label: "Pikes", level: 2}
]

var baseLinks = [
    {target: "mammal", source: "dog", strength: 0.7},
    {target: "mammal", source: "cat", strength: 0.7},
    {target: "mammal", source: "fox", strength: 0.7},
    {target: "mammal", source: "elk", strength: 0.7},
    {target: "insect", source: "ant", strength: 0.7},
    {target: "insect", source: "bee", strength: 0.7},
    {target: "fish", source: "carp", strength: 0.7},
    {target: "fish", source: "pike", strength: 0.7},
    {target: "cat", source: "elk", strength: 0.1},
    {target: "carp", source: "ant", strength: 0.1},
    {target: "elk", source: "bee", strength: 0.1},
    {target: "dog", source: "cat", strength: 0.1},
    {target: "fox", source: "ant", strength: 0.1},
    {target: "pike", source: "cat", strength: 0.1}
]



var nodes = [...baseNodes]
var links = [...baseLinks]
*/
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
            let type = JSON.parse(xhr.responseText).type;
            baseNodes = [];
            for (let i = 0; i < initLen; i++) {
                baseNodes[i] = {};
                baseNodes[i]['id'] = id[i];
                baseNodes[i]['group'] = 1;
                baseNodes[i]['label'] = name[i];
                baseNodes[i]['level'] = 1;
            }
            nodes = [...baseNodes]
            console.log(nodes);
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
            baseLinks = [];
            for (let i = 0; i < initLen; i++) {
                baseLinks[i] = {};
                baseLinks[i]['target'] = target[i];
                baseLinks[i]['source'] = source[i];
                baseLinks[i]['strength'] = 0.7;
            }
            links = [...baseLinks]
            console.log(links);
        }
    }
}


const width = window.innerWidth
const height = window.innerHeight

const svg = d3.select('svg')
svg.attr('width', width).attr('height', height)

let linkElements,
    nodeElements,
    textElements

// we use svg groups to logically group the elements together
const linkGroup = svg.append('g').attr('class', 'links')
const nodeGroup = svg.append('g').attr('class', 'nodes')
const textGroup = svg.append('g').attr('class', 'texts')

// we use this reference to select/deselect
// after clicking the same element twice
let selectedId

// simulation setup with all forces
const linkForce = d3
    .forceLink()
    .id(link => link.id)
    .strength(link => link.strength)

const simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2))

const dragDrop = d3.drag().on('start', (node) => {
    node.fx = node.x
    node.fy = node.y
}).on('drag', (node) => {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
}).on('end', (node) => {
    if (!d3.event.active) {
        simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
})

// select node is called on every click
// we either update the data according to the selection
// or reset the data if the same node is clicked twice
function selectNode(selectedNode) {
    if (selectedId === selectedNode.id) {
        selectedId = undefined
        resetData()
        updateSimulation()
    } else {
        selectedId = selectedNode.id
        updateData(selectedNode)
        updateSimulation()
    }

    const neighbors = getNeighbors(selectedNode, baseLinks)

    // we modify the styles to highlight selected nodes
    nodeElements.attr('fill', node => getNodeColor(node, neighbors))
    textElements.attr('fill', node => getTextColor(node, neighbors))
    linkElements.attr('stroke', link => getLinkColor(selectedNode, link))
}

// this helper simple adds all nodes and links
// that are missing, to recreate the initial state
function resetData() {
    const nodeIds = nodes.map(node => node.id)

    baseNodes.forEach((node) => {
        if (nodeIds.indexOf(node.id) === -1) {
            nodes.push(node)
        }
    })

    links = baseLinks
}

// diffing and mutating the data
function updateData(selectedNode) {
    const neighbors = getNeighbors(selectedNode, baseLinks)
    const newNodes = baseNodes.filter(node => neighbors.indexOf(node.id) > -1 || node.level === 1)

    const diff = {
        removed: nodes.filter(node => newNodes.indexOf(node) === -1),
        added: newNodes.filter(node => nodes.indexOf(node) === -1)
    }

    diff.removed.forEach(node => nodes.splice(nodes.indexOf(node), 1))
    diff.added.forEach(node => nodes.push(node))

    links = baseLinks.filter(link => link.target.id === selectedNode.id || link.source.id === selectedNode.id)
}

function updateGraph() {
    // links
    linkElements = linkGroup.selectAll('line').data(links, link => link.target.id + link.source.id)
    linkElements.exit().remove()

    const linkEnter = linkElements.enter().append('line').attr('stroke-width', 1).attr('stroke', 'rgba(50, 50, 50, 0.2)')

    linkElements = linkEnter.merge(linkElements)

    // nodes
    nodeElements = nodeGroup.selectAll('circle').data(nodes, node => node.id)
    nodeElements.exit().remove()

    const nodeEnter = nodeElements
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', node => node.level === 1 ? 'red' : 'gray')
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', selectNode)

    nodeElements = nodeEnter.merge(nodeElements)

    // texts
    textElements = textGroup.selectAll('text').data(nodes, node => node.id)
    textElements.exit().remove()

    const textEnter = textElements
        .enter()
        .append('text')
        .text(node => node.label)
        .attr('font-size', 15)
        .attr('dx', 15)
        .attr('dy', 4)

    textElements = textEnter.merge(textElements)
}

function updateSimulation() {
    updateGraph()

    simulation.nodes(nodes).on('tick', () => {
        nodeElements.attr('cx', node => node.x).attr('cy', node => node.y)
        textElements.attr('x', node => node.x).attr('y', node => node.y)
        linkElements
            .attr('x1', link => link.source.x)
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
    })
    simulation.force('link').links(links)
    simulation.restart()
}

function Force() {
    node_init();
    link_init();
    setTimeout(function () {
        updateSimulation();
    }, 500);
}