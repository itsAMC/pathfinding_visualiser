function astar() {
    var open = [startNode];
    var closed = [];
    var current;
    cycle();
    function cycle() {
        for (i = 0; i < open.length; i++) {
            if (typeof(current) == "undefined") {
                current = open[i];
            } else if (current.getFCost() > open[i].getFCost()) {
                current = open[i]
            }
        }
        //move current to closed list from open list
        closed.push(current);
        var index = open.indexOf(current);
        open.splice(index, 1);
        if(current.endNode) {
            return true;
        }

        neighbours = getNeighbours(current);
        open = open.concat(neighbours);
        for (i = 0; i < neighbours.length; i++) {
            neighbours[i].colour = "#99ebff";
        }
    }
}



