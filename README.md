# ngraph.coarsen

Given a community structure creates a coarse graph

# usage

``` js
// Let's say you have detected community of a graph using
// ngraph.cw or ngraph.louvain:
var community = detectCommunities(srcGraph);

// To build a coarse graph:
var coarsen = require('ngraph.coarsen');
var coarseGraph = coarsen(srcGraph, community)
```

Each node in the coarse graph is a community inside `srcGraph`. Link between
communities exists if members of each community are connected in the `srcGraph`.

* `node.data` property is a `Set` of node ids from the `srcGraph`;
* `link.data` is a number, that shows total number of connections (or weights)
between members of communities.

Note: each node in the coarse graph can also have a link with itself (a self-reference).
The weight of this link is equal to weight of all weights within community.

### Array of subgraphs

You can also get plain array of subgraphs for each found community:

``` js
var coarseGraph = coarsen(srcGraph, community)
var subgraphs = coarsen.getSubgraphs(coarseGraph);
// subgraphs is array, where each element has:
// * id - community id
// * graph - graph with nodes and edges that represent a subgraph of srcGraph
```


# See also

* https://github.com/anvaka/ngraph.graph - graph structure
* https://github.com/anvaka/ngraph.cw - label-propagation based community detection
* https://github.com/anvaka/ngraph.louvain - Louvain method for community detection
(based on modularity optimization)

# license

MIT
