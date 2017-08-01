var getSubgraph = require('ngraph.subgraph');

module.exports = getSubgraphs;

/**
 * Returns array of subgraphs given a coarse graph
 */
function getSubgraphs(coarseGraph) {
  var srcGraph = coarseGraph.srcGraph;
  if (!srcGraph) {
    throw new Error('srcGraph is not found');
  }

  var graphs = [];
  coarseGraph.forEachNode(function(node) {
    var subgraph = getSubgraph(node.data, srcGraph);
    graphs.push({
      id: node.id,
      graph: subgraph
    });
  });

  return graphs;
}
