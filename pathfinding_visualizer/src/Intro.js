import React, { Component } from 'react'
import { Link , BrowserRouter as Router, Route } from "react-router-dom";
import {Button , Jumbotron , Image} from "react-bootstrap";


export class Intro extends Component {


    render() {
        return (
            <div>
                <Jumbotron style={{marginBottom: "0px"}}>
                    <h1 style={{paddingBottom: "10px"}}>Pathfinding Visualiser</h1>
                    <p>
                        This is a application that uses OpenStreetMap to display
                        Pathfinding Algorithms. This is aimed at people who want to learn
                        Algorithms in a fun and interactive way.
                    </p>
                    <p>
                        To see the example with OpenStreetMap using the A* algorithm click the "Go to map button below".
                        Otherwise you can click the other button to see the grid example
                    </p>
                    <p>
                        To see code snippets explaining how these algorithms work click the last button!
                    </p>
                    <button className="btn btn-lg btn-danger" style={{margin: "10px 10px 10px 0px"}}><Link style={{color: "white"}} to="/map">Go to map</Link></button>
                    <button className="btn btn-lg btn-danger" style={{margin: "10px 10px 10px 0px"}}><Link style={{color: "white"}} to="/visualiser">Go to visualiser</Link></button>
                    <button className="btn btn-lg btn-danger" style={{margin: "10px 10px 10px 0px"}}><Link style={{color: "white"}} to="/snippets">Go to snippets</Link></button>
                
                </Jumbotron>
                <div>
                <Image src="https://www.growingwiththeweb.com/images/2012/06/03/grid-example.png" fluid/>
                </div>


            </div>
        )
    }
}


export default Intro
