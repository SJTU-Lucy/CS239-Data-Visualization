from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
import json


def read_csv(filepath):
    file = pd.read_csv(filepath)
    return file


app = Flask(__name__)
node = read_csv("static/data/test_node.csv")
link = read_csv("static/data/test_link.csv")


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/get_node_info', methods=['POST'])
def get_node_info():
    id = list(node['id'])
    name = list(node['name'])
    type = list(node['type'])
    res = {
        "id": id,
        "name": name,
        "type": type
    }
    return jsonify(res)


@app.route('/get_link_info', methods=['POST'])
def get_link_info():
    relation = list(link['relation'])
    source = list(link['source'])
    target = list(link['target'])
    res = {
        "relate": relation,
        "source": source,
        "target": target
    }
    return jsonify(res)


if __name__ == '__main__':
    app.run()
