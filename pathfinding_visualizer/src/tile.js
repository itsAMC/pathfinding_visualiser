function Tile (i,j,size) {
    this.i = i;
    this.j = j;
    this.x = i * size + 1;
    this.y = j * size + 1;
    this.size = size;
    this.walkable = true;
    this.start = false;
    this.end = false;
    this.open = false;
    this.colour = "#FFFFFF"
}


Tile.prototype.draw = function() {
    fill(this.colour);
    stroke(0);
    rect(this.x, this.y, this.size, this.size);
}

Tile.prototype.contains = function(x,y) {
    return (x > this.x && x < this.x+this.size && y > this.y && y < this.y+this.size);
}

Tile.prototype.invert = function() {
    this.walkable = !this.walkable;
    if(!this.walkable){
        this.colour = "#000000";
    } else {
        this.colour = "#FFFFFF";
    }
}

Tile.prototype.setStart = function() {
    this.walkable = true;
    this.start = true;
    this.colour = "#00FF00"
}

Tile.prototype.setEnd = function() {
     this.walkable = true;
     this.end = true;
     this.colour = "#FF0000"
}

Tile.prototype.clear = function() {
    this.walkable = true;
    this.end = false;
    this.start = false;
    fill("#000000");
    rect(this.x, this.y, this.size, this.size);
}

// distance from starting node
Tile.prototype.getHCost = function() {
    let xDist = abs(this.i - visualiser.startNode.i);
    let yDist = abs(this.j - visualiser.startNode.j);
    console.log(xDist, yDist);
    return xDist + yDist;
}

//distance from ending node
Tile.prototype.getGCost = function() {
    let xDist = abs(this.i - visualiser.endNode.i);
    let yDist = abs(this.j - visualiser.endNode.j);
    console.log(xDist, yDist);
    return xDist + yDist;
}

//distance from start + end
Tile.prototype.getFCost = function() {
    return this.getGCost() + this.getHCost();
}
