import React, {Component} from 'react';
import Node from './Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithm-logic/dijkstra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class DijkstraVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    // Set initial grid when component mounts
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    // Create a new grid that includes the walls just created
    const newGrid = getNewGridWithWalls(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  // Handles when mouse enters a div or element
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    // Create a new grid that includes the walls just created
    const newGrid = getNewGridWithWalls(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // Once we get to the last node we have visited, show shortest path.
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      // Update the css for each of the nodes we have visited to show animation of searching.
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    // Get all nodes that we have visited, in order visited.
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    // Calculate the shortest path backtracking from the finish node.
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // Finally, show the animaitions for searching and shortest path.
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetBoard() {
    const grid = getInitialGrid();
    grid.forEach(row => {
      row.forEach(node =>  {
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-start';
        } else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-finish';
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node';
        }
      })
    })
    this.setState({grid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <h5>Click on a square and drag to place walls between the starting node <span style={{color: "green"}}>(green)</span> and the end node <span style={{color: "red"}}>(red).</span> </h5>
        <h5>Once all the walls are placed, click the button below to find the shortest path between start and finish using Dijkstra's Algorithm.</h5>
        <hr></hr>
        <div onClick={() => this.visualizeDijkstra()}><a className="visualize-button">Visualize Dijkstra's Algorithm</a></div>
        <div onClick={() => this.resetBoard()}><a className="reset-button">Reset</a></div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}>
                    </Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

// Create a 50 row and 20 column grid with custom nodes.
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// Create layout for each node object in the grid.
// Distance always starts at Infinity, all nodes arent visited, and arent walls.
// PreviousNode will be the node we were on before we reached current node.
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

// Update the grid to include the wall that we just added.
const getNewGridWithWalls = (grid, row, col) => {
  // Create a copy of the current grid.
  const newGrid = grid.slice();
  // Isolate the current node clicked on
  const node = newGrid[row][col];
  // Copy all existing attributes, then make node a wall/take wall away.
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  // Update the node in newGrid to be the new node we just created.
  newGrid[row][col] = newNode;
  return newGrid;
};
