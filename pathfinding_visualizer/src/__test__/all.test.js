import React from "react"
import ReactDOM from "react-dom"
import { Link , BrowserRouter as Router} from "react-router-dom"
import Intro from "./../Intro"
import Map from "./../Map"
import Snippets from "./../Snippets"
import {isTSAnyKeyword} from "@babel/types"

// -- Component tests -- //

it("renders without crashing" , () => {
    const div = document.createElement("div")
    ReactDOM.render(<Router><Intro /></Router>, div)
})

// test will fail because of know bug in leaflet library with react
it("renders without crashing" , () => {
    const div = document.createElement("div")
    ReactDOM.render(<Router><Map /></Router>, div)
})

it("renders without crashing" , () => {
    const div = document.createElement("div")
    ReactDOM.render(<Snippets />, div)
})

// it("renders without crashing" , () => {
//     const div = document.createElement("div")
//     ReactDOM.render(<Router><Intro /></Router>, div)
// })



/* 
Due to complications with the current iteration of testing and babel in react we were unable to import
functions to test without the test suite crashing. This forced us to copy-paste the existing functions
over to be tested. When the problems with the lib are fixed we will make the tests automated
*/


test("checkObjects - should return false", ()=> {
    const obj1 = {name : "Aaron"}
    const obj2 = [{name : "Aaron"}]
    const val = checkObjects(obj1 , obj2)
    expect(val).toBeFalsy()
})

test("deleteItem - should return true", ()=> {
    const obj1 = [{name : "Aaron"}]
    const obj2 = {name : "Aaron"}
    const val = deleteItem(obj1 , obj2)
    expect(val).toEqual([])
})

test("getClosest - should return lowest obj", ()=> {
    const obj1 = [{name : "Aaron" , weight: 20}]
    const obj2 = {name : "Bob" , weight: 31}
    const val = getClosest([obj1 , obj2])
    expect(val).toEqual(obj1)
})

test("getDistanceFromLongLat - should return true", ()=> {
    const val = getDistanceFromLatLonInM(53 , 100 , 10 , -54)
    expect(val).toEqual(1258772.7653906024)
})

/* Functions to be imported when babel is fixed in react */

const getClosest = (ways) => {
    let lowest = ways[0]
    for (let w of ways){
        if (w.weight < lowest.weight){
            lowest = w
        }
    }
    return lowest
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

const checkObjects = (w , l) => {
    for (let o of l){
        if (JSON.stringify(o) == JSON.stringify(w)){
            return false
        }
    }
    return true
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