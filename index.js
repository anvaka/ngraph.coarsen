var createGraph = require('ngraph.graph');

module.exports = coarsen;
module.exports.getSubgraphs = require('./lib/getSubgraphs.js');

function coarsen(srcGraph, community) {
  if (typeof community.canCoarse === 'function') {
    if (!community.canCoarse()) {
       console.warn('Cannot coarse anymore');
    }
  }

  var graph = createGraph();

  srcGraph.forEachLink(function(srcLink) {
    var fromCommunity = community.getClass(srcLink.fromId);
    var toCommunity = community.getClass(srcLink.toId);

    if (fromCommunity === toCommunity) {
      makeSureNodeAdded(fromCommunity, srcLink.fromId);
      makeSureNodeAdded(fromCommunity, srcLink.toId);
    } else {
      makeSureNodeAdded(fromCommunity, srcLink.fromId);
      makeSureNodeAdded(toCommunity, srcLink.toId);
    }

    var link = graph.getLink(fromCommunity, toCommunity);
    if (!link) link = graph.addLink(fromCommunity, toCommunity, 0);
    link.data += getWeight(srcLink.data);
  });

  var isolateNodes = new Set();
  var isolateCommunityId;

  srcGraph.forEachNode(function(node) {
    // if node is islate the forEachLink will never visit it, which means
    // its community class is never added to the graph:
    var nodeCommunity = community.getClass(node.id);
    if (graph.getNode(nodeCommunity)) {
      // this was not an isolate. Ignore;
      return;
    }

    if (isolateCommunityId === undefined) {
      // we don't care which node will represent isolated community.
      isolateCommunityId = nodeCommunity;
    }

    isolateNodes.add(node.id);
  });

  if (isolateNodes.size > 0) {
    // Each node in the isolated nodes has no links. So they all belong to the
    // same community. We take arbitrary node from this class and assign them
    // all to the same community:
    graph.addNode(isolateCommunityId, isolateNodes);
  }

  graph.srcGraph = srcGraph;

  return graph;

  function makeSureNodeAdded(nodeId, srcNodeId) {
    var node = graph.getNode(nodeId);
    if (!node) node = graph.addNode(nodeId, new Set());

    node.data.add(srcNodeId);

    return node;
  }
}

function getWeight(data) {
  if (!data) return 1;

  if (typeof data === 'number') return data;
  if (typeof data.weight === 'number') return data.weight;

  return 1;
}
