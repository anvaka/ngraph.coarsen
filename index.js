var createGraph = require('ngraph.graph');

module.exports = coarsen;

function coarsen(srcGraph, community) {
  if (typeof community.canCoarse === 'function') {
    if (!community.canCoarse()) {
       console.warn('Cannot coarse anymore');
    }
  }

  var graph = createGraph({
    uniqueLinkId: false
  });

  srcGraph.forEachLink(function(srcLink) {
    var fromCommunity = community.getClass(srcLink.fromId);
    var toCommunity = community.getClass(srcLink.toId);

    if (fromCommunity === toCommunity) {
      makeSureNodeAdded(fromCommunity, srcLink.fromId);
    } else {
      makeSureNodeAdded(fromCommunity, srcLink.fromId);
      makeSureNodeAdded(toCommunity, srcLink.toId);
    }

    var link = graph.getLink(fromCommunity, toCommunity);
    if (!link) link = graph.addLink(fromCommunity, toCommunity, 0);
    link.data += getWeight(srcLink.data);
  });

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
