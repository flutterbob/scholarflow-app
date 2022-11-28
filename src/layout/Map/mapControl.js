/*
 * @Author: yizheng
 * @Date: 2022-11-22 20:03:03
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-28 21:24:42
 * @FilePath: \scholarflow-app\src\layout\Map\mapControl.js
 * @Description:
 */

/* global fetch */
import React, { useState, useMemo, useEffect } from 'react';
import { Map } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import { scaleQuantile } from 'd3-scale';
import * as CommonUtils from './../../publicUtil/commonUtils';

export const inFlowColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132],
];

export const outFlowColors = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [252, 78, 42],
  [227, 26, 28],
  [177, 0, 38],
];

const INITIAL_VIEW_STATE = {
  longitude: -100,
  latitude: 40.7,
  zoom: 3,
  maxZoom: 15,
  pitch: 30,
  bearing: 30,
};

// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibGVvZmx1dHRlciIsImEiOiJjbGF3Z2hpMW0wZjl5M3JtcDA2cXp2MGFiIn0.QSWWtkCEaG-r8hJjrz63FQ';

function calculateArcs(data, selectedCounty) {
  if (!data || !data.length) {
    return null;
  }
  if (!selectedCounty) {
    selectedCounty = data.find((f) => f.properties.name === 'Los Angeles, CA');
  }
  const { flows, centroid } = selectedCounty.properties;

  const arcs = Object.keys(flows).map((toId) => {
    const f = data[toId];
    return {
      source: centroid,
      target: f.properties.centroid,
      value: flows[toId],
    };
  });

  const scale = scaleQuantile()
    .domain(arcs.map((a) => Math.abs(a.value)))
    .range(inFlowColors.map((c, i) => i));

  arcs.forEach((a) => {
    a.gain = Math.sign(a.value);
    a.quantile = scale(Math.abs(a.value));
  });

  return arcs;
}

function getTooltip({ object }) {
  return object && object.properties.name;
}

/* eslint-disable react/no-deprecated */
export const MapControl = (props) => {
  const { data, strokeWidth = 1, mapStyle = MAP_STYLE } = props;
  const [selectedCounty, selectCounty] = useState(null);

  const arcs = useMemo(() => calculateArcs(data, selectedCounty), [data, selectedCounty]);

  const filePath = './../../dataset/CNKI.txt';
  // CommonUtils.fileReader(filePath);

  useEffect(() => {
    // CommonUtils.getScholarInit();
    CommonUtils.getScholarCityLink();
    CommonUtils.getScholarProvinceLink();
  }, []);
  const layers = [
    new GeoJsonLayer({
      id: 'geojson',
      data,
      stroked: false,
      filled: true,
      getFillColor: [0, 0, 0, 0],
      onClick: ({ object }) => selectCounty(object),
      pickable: true,
    }),
    new ArcLayer({
      id: 'arc',
      data: arcs,
      getSourcePosition: (d) => d.source,
      getTargetPosition: (d) => d.target,
      getSourceColor: (d) => (d.gain > 0 ? inFlowColors : outFlowColors)[d.quantile],
      getTargetColor: (d) => (d.gain > 0 ? outFlowColors : inFlowColors)[d.quantile],
      getWidth: strokeWidth,
    }),
  ];

  return (
    <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true} getTooltip={getTooltip}>
      <Map reuseMaps mapStyle={mapStyle} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
};

// export function renderToDOM(container) {
//   render(<App />, container);

//   fetch(DATA_URL)
//     .then((response) => response.json())
//     .then(({ features }) => {
//       render(<App data={features} />, container);
//     });
// }
