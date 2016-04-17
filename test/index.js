var coarsen = require('../');
var test = require('tap').test;
var createGraph = require('ngraph.graph');

test('simple graph with node as community', function(t) {
  var srcGraph = createGraph();
  srcGraph.addLink(1, 2);

  var fakeCommunity = {
    getClass: function getClass(nodeId) { return nodeId; }
  }

  var newGraph = coarsen(srcGraph, fakeCommunity);

  t.equals(newGraph.getLinksCount(), 1, 'There is exactly one link');
  t.equals(newGraph.getNodesCount(), 2, 'There are two nodes');

  var link = newGraph.getLink(1, 2);
  t.ok(link, 'Link exists')
  t.equals(link.data, 1, 'Weight is correct.')

  t.ok(newGraph.getNode(1).data.has(1), 'first node has original node')
  t.ok(newGraph.getNode(2).data.has(2), 'second node has original node')

  t.end();
});

test('it accumulates weights', function(t) {
  var srcGraph = createGraph();
  srcGraph.addLink(1, 2);
  srcGraph.addLink(2, 3);
  srcGraph.addLink(1, 3);

  var fakeCommunity = {
    getClass: function getClass(nodeId) {
      // now we pretend that if nodes are odd - they belong to the same community:
      return nodeId % 2;
    }
  }

  var newGraph = coarsen(srcGraph, fakeCommunity);

  t.equals(newGraph.getLinksCount(), 3, 'There should be two links');
  t.equals(newGraph.getNodesCount(), 2, 'There are two nodes: even and odd');

  var loop = newGraph.getLink(1, 1);
  t.ok(loop, 'loop link exists')
  t.equals(loop.data, 1, 'loop weight is correct.')

  var link01 = newGraph.getLink(0, 1);
  t.ok(link01, '0 -> 1 link exists')
  t.equals(link01.data, 1, 'Weight is correct.')

  var link10 = newGraph.getLink(1, 0);
  t.ok(link10, '1 -> 0 link exists')
  t.equals(link10.data, 1, 'Weight is correct.')

  var odd = newGraph.getNode(1).data;
  t.ok(odd.has(1) && odd.has(3) && odd.size === 2, 'odd node has original node')

  var even = newGraph.getNode(0).data;
  t.ok(even.has(2) && even.size === 1, 'even node has original node')

  t.end();
});
