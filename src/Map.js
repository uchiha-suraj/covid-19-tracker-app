import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";    //install react-leaflet and leaflet npm for Map.
import "./Map.css";
import { showDataOnMap } from "./util";


function Map ({ countries, casesType, center, zoom }) {  //getting the values of these props form App.js
  
  return (
    <div className="map">
      {/* center => center of the map with proper latitude and longitude
          zoom =>  how far do we want the map to zoom in, pass a number. */}
      <LeafletMap center={center} zoom={zoom} >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop through countries and draw circles */}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;