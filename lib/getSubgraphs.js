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
    graphs.push(getSubgraph(node.data, srcGraph));
  });

  return graphs;
}
