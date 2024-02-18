import './App.css'
import React, { useEffect, useState } from 'react';

class Node {
  constructor(id, weight) {
    this.id = id;
    this.weight = weight;
  }
}

class Edge {
  constructor(src, dest, weight) {
    this.src = src;
    this.dest = dest;
    this.weight = weight;
  }
}

class Graph {
  constructor(V) {
    this.vertices = V;
    this.adjacencyList = new Array(V).fill(null).map(() => []);
  }

  addEdge(src, dest, weight) {
    this.adjacencyList[src].push(new Node(dest, weight));
    this.adjacencyList[dest].push(new Node(src, weight)); // For undirected graph
  }

  dijkstra(src, dest) {
    const pq = new PriorityQueue();
    const distance = new Array(this.vertices).fill(Number.MAX_SAFE_INTEGER);
    const parent = new Array(this.vertices).fill(-1);

    pq.enqueue({ id: src, weight: 0 });
    distance[src] = 0;

    while (!pq.isEmpty()) {
      const current = pq.dequeue();

      for (const neighbor of this.adjacencyList[current.id]) {
        const newDist = distance[current.id] + neighbor.weight;
        if (newDist < distance[neighbor.id]) {
          distance[neighbor.id] = newDist;
          parent[neighbor.id] = current.id;
          pq.enqueue({ id: neighbor.id, weight: newDist });
        }
      }
    }

    const shortestPathEdges = [];
    let current = dest;
    while (parent[current] !== -1) {
      shortestPathEdges.push(new Edge(parent[current], current, distance[current] - distance[parent[current]]));
      current = parent[current];
    }

    shortestPathEdges.reverse();
    return shortestPathEdges;
  }
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(node) {
    this.heap.push(node);
    this.bubbleUp();
  }

  dequeue() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown();
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const element = this.heap[index];
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.weight >= parent.weight) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  sinkDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.weight < element.weight) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild.weight < element.weight) ||
          (swap !== null && rightChild.weight < leftChild.weight)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}

const App = () => {
  const [shortestPathEdges, setShortestPathEdges] = useState([]);
  const [sourceIndex,setSourceIndex] = useState(2);
  const [destinationIndex,setDestinationIndex] = useState(4);
  const p = ["GOVINDPURAM", "IMS", "ABES", "Purana Buss Adda", "Railway Station", "Metro"];
  
  useEffect(() => {
    const graph = new Graph(6);
    graph.addEdge(0, 1, 10);
    graph.addEdge(0, 3, 20);
    graph.addEdge(1, 2, 20);
    graph.addEdge(1, 3, 20);
    graph.addEdge(3, 4, 10);
    graph.addEdge(3, 5, 10);

    const pathEdges = graph.dijkstra(sourceIndex, destinationIndex);
    setShortestPathEdges(pathEdges);
  }, [sourceIndex, destinationIndex]);
  return (
    <div>
      <div className='head'>
        <h1>EASYYYYWAYYYY</h1>
      </div>

      <div className='main'>
          <div className='box'><b>Source</b></div> 
          <div className='box'><b>Destination</b></div> 
          <div className='box'><b>Cost</b></div> 
      </div>

      {shortestPathEdges.map((edge, index) => (
        <div key={index} className='main'>
          <div className='box'>{p[edge.src]}</div> 
          <div className='box'>{p[edge.dest]}</div> 
          <div className='box'>Rs.{edge.weight}</div> 
        </div>
      ))}


<br/>
<br/>
<br/>

      <div className='selectbox'>
        <label htmlFor="source">select Source:</label>
        
        <select id="source" name="areas" onChange={(e)=>{setSourceIndex(e.target.value)}} value={sourceIndex}>
        {p.map((item, index) => (
          <option key={index} value={index}>{item}</option>
      ))}
        </select>
        <label htmlFor="desti">select Destination:</label>
        <select id="desti" name="areas" onChange={(e)=>{setDestinationIndex(e.target.value)}}  value={destinationIndex}>
        {p.map((item, index) => (
          <option key={index} value={index}>{item}</option>
      ))}
        </select>
      </div>
      <div className='footer'></div>
    </div>
  );
};

export default App;
