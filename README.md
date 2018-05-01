# interactivemapdesign

## Projection Name 
US airport map 

## Introduction
In this lab, an interact web map of US airports is designed. 
styling the map elements to provide proper symbolization for the data and map projections are the main focus of this lab
Elements that can be customized to include thematic layers (i.e., points, lines, and polygons), base maps (as a leaflet tileLayer),
interactive features (the components of the map that allow for user interaction), and legends and supplemental information (such as credits, etc.).

## Major functions


#### 1. Projection Selection
**_Albers Equal Area Conic (Heinrich Albers, 1805)_**   is a very popular map projection for the US, Canada and other continental/large countries with a primarily E-W extent.
 the U.S. This projection is heavily optimized for the characteristics of the United States: wider east to west than north to south..It Used by the USGS for maps showing the conterminous United States or large areas of the United States. 
All areas on the map are proportional to the same areas on the Earth. Directions are reasonably accurate in limited regions.
Therefore, esri projection (ESRI:102003) - USA contiguous albers equal area conic has been selected to be used as the map projection.

#### 2. Adding dynamic lables by using the lable function
The label function is supported by the Label Gun library, which is a mapping library agnostic labelling engine.

#### 3. BindPopup
assign a bindPopup function to the onEachFeature parameter of the airports objects to bind a popup window. 
The content of the popup window is the value of a specific propertiy for each object.

