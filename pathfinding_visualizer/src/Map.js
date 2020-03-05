import React, { Component } from 'react'
import {Button} from "react-bootstrap"
import L from "leaflet";

import icon from 'leaflet/dist/images/marker-icon.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [31, 51],
    iconAnchor: [20, 51],
    popupAnchor: [0, -51]
});

L.Marker.prototype.options.icon = DefaultIcon;

export class Map extends Component {

    state = {}

    // Use this to run code when the componants load

    componentDidMount() {

        // Map setup

        const position = [53.385879, -6.258627]
        const map = L.map('map_id').setView(position, 15)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          dragging: false
        }).addTo(map)

        const layerGroup = L.layerGroup().addTo(map);
             
        let mainClicked = false
        let routing;

        async function main() {
            // Get the data from overpass API
            const data = await getData("http://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0Away%5B%22highway%22~%22%20%09motorway%7Ctrunk%7Cprimary%7Csecondary%7Ctertiary%7Cunclassified%7Cresidential%7Croad%7Cservice%22%5D%2853.3730114383522%2C-6.280703544616698%2C53.39599710607319%2C-6.2354278564453125%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B");
            
            mainClicked = true
            
            // Parse the JSON data and get the ways and nodes
            let ways = data.elements.slice(0,1136)
            let nodes = data.elements.slice(1136, data.elements.length)
            let goalNode = "274273233"
            let startNode;
            for (let target of ways) {
                for(let n of target.nodes){
                    if(n == "59612100"){
                        startNode = target
                        break
                    }
                }
            }  


            // Get heuristic weights
            let waysToCheck = []
            let waysChecked = []

            let weight1 = getLongLats([startNode.nodes[0]] , nodes)
            let weight2;
            for (let w of ways){
                for (let n of w.nodes){
                    if (n == goalNode){
                        weight2 = getLongLats([n] , nodes)
                    }
                }
            }

            // loop that finds the intersection nodes and picks the next way to scan
            waysToCheck.push({way: startNode , weight: getDistanceFromLatLonInM(weight1[0][0] , weight1[0][1] , weight2[0][0] , weight2[0][1])})
            let check = true
            while (waysToCheck.length !== 0){
                let test = getClosest(waysToCheck)
                for(let node of test.way.nodes){
                    if (node == goalNode){
                        check = false

                    }
                    for(let w of ways){
                        for(let n of w.nodes){
                            if (n == node && checkObjects(w , waysChecked)){
                                waysToCheck.push({way : w, weight: getDistanceFromLatLonInM(getLongLats([n] , nodes)[0][0], getLongLats([n] , nodes)[0][1] , weight2[0][0] , weight2[0][1]) })
                                waysChecked.push(w)
                                break
                            }     
                        
                        }
                        if (check == false){
                            break
                        }
                    }
                    if (check == false){
                        break
                    }
                }
                if (check == false){
                    break
                }
                waysToCheck = deleteItem(waysToCheck , test)
                

            } 

            // show the animations
            startEndMarkers([goalNode, "59612100"] , nodes)

            function timer(ms) {
                return new Promise(res => setTimeout(res, ms));
               }
               
            async function load () { // We need to wrap the loop into an async function for this to work
                for (let w of waysChecked){
                    let coords = getLongLats(w.nodes , nodes)
                    drawLine(coords)
                    await timer(300);
                }
                shortestPath([goalNode, "59612100"] , nodes)
                await timer(300)
                deleteLayers()
                }
               
            load();

        }

        // HELPER FUNCTIONS

        const drawLine = (array) => {
            const polyLine = L.polyline(array , {color: "red"}).addTo(map);
            polyLine.addTo(layerGroup);

        }

        async function getData(url) {
            const response = await fetch(url);
            return response.json()
        }

        function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
            lat1 = parseFloat(lat1)
            lat2 = parseFloat(lat2)
            lon1 = parseFloat(lon1)
            lon2 = parseFloat(lon2)
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1); 
            var a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2)
              ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return d * 100
          }
          
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }


        this.setState({function: function(){
            if (mainClicked !== true){
                main()
            }
        }})

        this.setState({reset: function(){
            if (mainClicked == true){
                map.removeControl(routing)
                mainClicked = false
            }

        }})

        const deleteLayers = () => {
            layerGroup.clearLayers()
            
        }

        const startEndMarkers = (nodeL , nodes) => {
            const coords = []
            for (let node of nodeL){
                for (let n of nodes){
                    if (n.id == node){
                       const marker = L.marker([n.lat , n.lon]).addTo(map)
                       marker.addTo(layerGroup)
                       coords.push([n.lat , n.lon])
    
                    }
                }
            }
        }

        const shortestPath = (nodeL , nodes) => {
            const coords = []
            for (let node of nodeL){
                for (let n of nodes){
                    if (n.id == node){
                       const marker = L.marker([n.lat , n.lon]).addTo(map)
                       marker.addTo(layerGroup)
                       coords.push([n.lat , n.lon])
    
                    }
                }
            }
            routing = L.Routing.control({
                waypoints : [
                    L.latLng(coords[1][0] , coords[1][1]),
                    L.latLng(coords[0][0] , coords[0][1]),
                ],
                lineOptions: {
                    styles: [{color: "green"}]
                 }
            }).addTo(map)

        }

        const deleteItem = (waysToCheck , item) => {
            let index = 0
            let l = []
            for(let i of waysToCheck){
                if(JSON.stringify(i) !== JSON.stringify(item)){
                    l.push(i)
                }
                i +=1
            }
            return l
        }

        const getClosest = (ways) => {
            let lowest = ways[0]
            for (let w of ways){
                if (w.weight < lowest.weight){
                    lowest = w
                }
            }
            return lowest
        }

        const checkObjects = (w , l) => {
            for (let o of l){
                if (JSON.stringify(o) == JSON.stringify(w)){
                    return false
                }
            }
            return true
        }

        const getLongLats = (wayNodes , nodes) => {
            let l = []

            for (let nodeId of wayNodes){
                for(let node of nodes){
                    if (node.id == nodeId){
                        l.push([node.lat , node.lon])
                    }
                }
            }
            return l;
        }

        
    }


    // Main react function
    render() {
        return (
            <React.Fragment>
                <div id="map_id" style={mapStyles}></div>
                <div style={info}>
                    <h1 style={h1Style}>A * Example</h1>
                    <p style={p}>This is an example of how a pathfinding algorithm would traverse through a map. This example uses a hybrid of Dijkstra's Shortest Path algorithm with a heuristic weight which makes the algorithm choose smarter paths.</p>
                    <p style={p}>The starting destination is the intersection from shanliss avenue to shanliss road. The reason I chose this as the start is because it has multiple ways to choose. The destination is the bus stop by the helix in DCU</p>
                    <p style={p}>To start the animation click the go button. To reset click the reset button. Note that the once you click go you cant reset until the shortest path is displayed</p>
                </div>
                <Button variant="success" onClick={this.state.function} style={button}>Click to go</Button>
                <Button variant="secondary" onClick={this.state.reset} style={button}>Click to reset</Button>

            </React.Fragment>
        )
    }
}

// Styles



const p = {
    padding: "10px"
}

const h1Style = {
    padding: "10px",
    background: "red"
}

const info = {
    width: "30%",
    height: "700px"
}

const button = {
    width: "30%",
    height: "125px"
}

const mapStyles = {
    width: "70%",
    height: "950px",
    float: "right"
}

export default Map
