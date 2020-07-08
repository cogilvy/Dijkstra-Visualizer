// We want to return all of the visited nodes in the order in which they were visited.
// Each node needs to keep track of two things:
// 1. Distance from start node.
// 2. The node that was visitied before it.
// We will backtrack from the final node to find the shortest path.

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  // Set the distance of the start node to 0.
  startNode.distance = 0;
  // Get all of the nodes on the grid.
  const unvisitedNodes = getAllNodes(grid);
  // Use while loop as long as unvisitedNodes contains any nodes.
  while (!!unvisitedNodes.length) {
    // Sort nodes by their distance from the start node.
    sortNodesByDistance(unvisitedNodes);
    // Since the start node has distance = 0, it will become the closestNode
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall skip it
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity we are trapped.
    // The first run through, the start node should have a distance of 0, then
    // when we updateUnvisitedNeighbors, the closest node should have a distance of 1.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    // Mark that we have visited the closest node.
    closestNode.isVisited = true;
    // Add closest node to array of visited nodes.
    visitedNodesInOrder.push(closestNode);
    // If we reach the end, return array of visited nodes in order we visited them.
    if (closestNode === finishNode) return visitedNodesInOrder;
    // If we didnt reach the end, we need to visit all our neighbors next...
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

// Grab every node in the whole grid.
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Sort the nodes in unvisitedNodes array by their distance from startNode.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// This will find the unvisited neighbor nodes from the current node we are on.
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  // If we are in the 2nd row or lower, add the neighbor above node.
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // If we are in the 2nd row from bottom or above, add neighbor below node.
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  // If we are in the 2nd column or more, add neighbor to the left of node.
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // If we are in the 2nd to last column or less, add neighbor to the right of node.
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  // Return all the neighbors to the node that arent visited yet.
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Update the distance values for each neighbor.
function updateUnvisitedNeighbors(closestNode, grid) {
  // First get all neighbors for current node.
  const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
  // For each neighbor of the current node...
  for (const neighbor of unvisitedNeighbors) {
    // Make their distance value 1 more than closestNode
    neighbor.distance = closestNode.distance + 1;
    // Mark the previousNode value as the current node we are working with.
    neighbor.previousNode = closestNode;
  }
}

// Backtracks from the finishNode to find the shortest path to startNode.
// Must be called AFTER the dijkstra method!
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  // While the finishNode isnt null
  while (finishNode !== null) {
    nodesInShortestPathOrder.unshift(finishNode);
    finishNode = finishNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
