import React, { Component } from 'react'
import {Button , ButtonGroup , Jumbotron} from "react-bootstrap"
import "./Snippets.css"

class Snippets extends Component {

    state = {
        func: function(algo){
            document.getElementById("algo").textContent = algo
        },
        desc: function(desc){
            document.getElementById("desc").textContent = desc
        }
    }

    render() {
        return (
            <div>
                <Jumbotron style={{marginBottom: "0px"}}>
                    <h1>This is the page that describes how the algorithms work and theres code snippets to go accompany it</h1>
                    <p>Click the one of the buttons to view the code and descripton!</p>
                </Jumbotron>
                <div className="d-flex flex-column">
                    <ButtonGroup size="lg">
                        <Button variant="dark" onClick={() => {this.state.func(a_star); this.state.desc(a_star_desc)}}>Click to view A*</Button>
                        <Button variant="dark" onClick={() => {this.state.func(dijkstra); this.state.desc(dijkstra_desc)}}>Click to view Dijkstra's</Button>
                        <Button variant="dark" onClick={() => {this.state.func(bfs); this.state.desc(bfs_desc)}}>Click to view Breadth First Search</Button>
                        <Button variant="dark" onClick={() => {this.state.func(dfs); this.state.desc(dfs_desc)}}>Click to view Depth First Search</Button>
                    </ButtonGroup>
                </div>
                <p style={pStyle} id="desc"></p>
                <pre id="algo" style={{padding: "20px"}}></pre>
            </div>
        )
    }
}

const pStyle = {
    padding: "10px",
    backgroundColor: "#343a40",
    color: "white"
}

const a_star_desc = ` A star (A*) is one of the most used pathfinding algorithms due to its efficiency in its decision making. It uses something called a heuristic to determine how close the current node is to the destination node. When choosing the next node to traverse it adds this heuristic to the distance from the start node and picks the lowest number.`

const a_star = `graph = {
    'a':{'b':3,'c':4, 'd':7},
    'b':{'c':1,'f':5},
    'c':{'f':6,'d':2},
    'd':{'e':3, 'g':6},
    'e':{'g':3, 'h':4},
    'f':{'e':1, 'h':8},
    'g':{'h':2},
    'h':{'g':2}
}

heuristics = {
    "a" : 10,
    "b" : 7,
    "c" : 6,
    "d" : 8,
    "e" : 3,
    "f" : 5,
    "g" : 6,
    "h" : 0
}


def a_star(graph , start , goal):

    shortest_from_start = {} # dict to hold distance from start node
    total_dist = {} # heuristic + dist from start
    previous_node = {} # holds previous node for backtracking
    checked_nodes = [] # list to avoid double checking nodes
    curr_node = start

    # loop to setup shortest from start dict with its distance being infinity (big number in this case)
    for node in graph.keys():
        shortest_from_start[node] = 99999
    shortest_from_start[start] = 0 # starting node is always 0

    while True: # infinite loop that gets broken later
        checked_nodes.append(curr_node)
        try:
            del(total_dist[curr_node]) # if the current node is in total_dist then its already been worked on so delete it we dont need it
        except KeyError:
            pass
        for node , weight in graph[curr_node].items(): # get the current nodes connected nodes and their weight
            if node not in checked_nodes: # make sure we dont add a checked node
                shortest_calc = weight + shortest_from_start[curr_node]
                if shortest_calc < shortest_from_start[node]: # only update the node if the distance from start is less
                    # update the nodes values
                    shortest_from_start[node] = shortest_calc
                    previous_node[node] = curr_node
                    total_dist[node] = shortest_calc + heuristics[node]


        sorted(total_dist, key=total_dist.__getitem__) # sort the heuristic totals by val (get the smallest)
        for node , val in total_dist.items():
            curr_node = node # change the node to be worked on next to the smallest heuristic value
            break
        if curr_node == goal: # check if we have hit the goal node
            break
    
    # Code to backtrack up the graph
    path = []
    backtracking_start = goal # start the backtrack at the goal
    while backtracking_start != start:
        path.append(backtracking_start)
        backtracking_start = previous_node[backtracking_start] # keeps going backwards until it hits the start node
    path.append(start)
    
    print("The shortest distance is " + str(shortest_from_start[goal]))
    print("The path to the goal node is "+ str(path[::-1]))
    


a_star(graph , "a" , "h")

"""
Output:

The shortest distance is 13
The path to the goal node is ['a', 'c', 'd', 'e', 'h']

"""
`

const dijkstra_desc = `Dijkstras algorithm or Dijkstras shortest path is a pathfinding algorithm that uses the concept of weights to find the shortest path to a destination

The algorithm starts from a set node in a tree. Each node has a set weight that is set to infinity before the algorithm starts. This is because we do not know
the distance to that node yet. The nodes are connected by routes that have a set weight. 

The way the algorithm finds the shortest path is by traversing each route starting with the lowest weight route and when it reaches a node it updates its distance from the original (leaf) node with the weight of the route.
The algorithm then keeps picking the shortest weight path until each node is closed off (no paths left to check).`

const dijkstra = `graph = {

    'a':{'b':3,'c':4, 'd':7},
    'b':{'c':1,'f':5},
    'c':{'f':6,'d':2},
    'd':{'e':3, 'g':6},
    'e':{'g':3, 'h':4},
    'f':{'e':1, 'h':8},
    'g':{'h':2},
    'h':{'g':2}
    }
    
    
    def dijkstra(graph,start,goal):
    
        shortest_distance = {} #dictionary to record the cost to reach a node
        predecessor = {} #dictionary used for backtracking
        unseenNodes = graph #used in iteration
        infinity = 999999 # cant do inf so just a large num
        traceback = [] #used in traceback to find the shortest path
    
        # loop to set all node weights to infinity
        for node in unseenNodes:
            shortest_distance[node] = infinity
    
        shortest_distance[start] = 0 # start node is 0 always
    
        # infinte loop so we know we've looked at all nodes
        while unseenNodes:
            min_distance = None
            # simple loop to find shortest path
            for node in unseenNodes:
                if min_distance is None:
                    min_distance = node
    
                elif shortest_distance[node] < shortest_distance[min_distance]:
                    min_distance = node
    
            # find the next possible paths
            path_options = graph[min_distance].items()
    
            for child_node, weight in path_options:
                if weight + shortest_distance[min_distance] < shortest_distance[child_node]:
                    shortest_distance[child_node] = weight + shortest_distance[min_distance] # update shortest distance if found
                    predecessor[child_node] = min_distance # add item to use later to find shortest path
    
            unseenNodes.pop(min_distance) # remove values that we've iterated over
    
        curr = goal # start from the destination node and backtrack
    
        while curr != start:
            try:
                traceback.insert(0,curr) # keep track of path
                curr = predecessor[curr] # backtrack to curr value
            except KeyError:
                print("No route to path")
                break
        traceback.insert(0,start) # finished
    
        #if val isnt infinity then we have found a shortest path
        if shortest_distance[goal] != infinity:
            print("The shortest distance is " + str(shortest_distance[goal]))
            print("The path to the goal node is "+ str(traceback))
    
    
    dijkstra(graph, 'a', 'h')`

const bfs_desc = `Breadth first search is an exhaustive search algorithm. It traverses the tree in a layered style (i.e each level of the trees nodes gets scanned). The tree is usually scanned from left to right.

This algorithm is rarely used as its quite costly. Only use it if you know the item is close to the root node`

const bfs = `graph = {
    "a" : ["b","c"],
    "b" : ["d"],
    "c" : ["e" , "f"],
    "d" : [],
    "e" : ["g"],
    "f" : [],
    "g" : []
}

def bfs(graph):
    queue = [] # queue to store nodes that need traversing
    for node in graph.keys():
        queue.append(node) # set up the first key in the queue
        break
    nodes_visited = [] # list for nodes traversed i.e path
    while queue: # keep going until theres nothing left in queue (the tree is traversed)
        current_node = queue.pop(0)
        connected_nodes = graph[current_node] # get a list of nodes to traverse next
        if current_node not in nodes_visited: # test if we have already visited the node (helps with backtracking)
            nodes_visited.append(current_node)
            for q_node in connected_nodes: # add new nodes to the tree
                queue.append(q_node)
    return nodes_visited

print(bfs(graph))

"""
output:

['a', 'b', 'c', 'd', 'e', 'f', 'g']
"""`

const dfs_desc = `Depth first search is an exhaustive search algorithm. It lazily scans the entire graph from left to right, For example it will always go left until there is no leaf nodes then backtrack and go right.

This algorithm is mostly used to traverse a graph where you know the goal node is left leaning. Its complexity can vary quite a lot which makes it less appealing`

const dfs = `# Test data
graph = {
    "a" : ["b","c"],
    "b" : ["d"],
    "c" : ["e" , "f"],
    "d" : [],
    "e" : ["g"],
    "f" : [],
    "g" : []
}


def dfs(graph):
    queue = [] # used to store nodes we need to check
    for node in graph.keys(): # used to get first node in the graph into the queue
        queue.append(node)
        break
    nodes_visited = [] # used to store nodes we've checked i.e its path
    while queue: # as long as theres something in the queue we keep going
        current_node = queue.pop(0)
        connected_nodes = graph[current_node] # get the connected nodes
        if current_node not in nodes_visited:
            nodes_visited.append(current_node) # append the current checked node
            for q_node in connected_nodes[::-1]: # scan through the connected nodes (reversed for easier insertion to the queue)
                queue.insert(0 , q_node) # insert items into the first slot in the list. This is because we want to add all the left leaning items and check them first, then backtrack
    return nodes_visited

print(dfs(graph))

"""
Output:

['a', 'b', 'd', 'c', 'e', 'g', 'f']
"""`

export default Snippets
