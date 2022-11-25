/*
 * @Author: yizheng
 * @Date: 2022-11-22 20:03:03
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-22 20:19:11
 * @FilePath: /scholarflow-app/src/layout/Map/mapControl.js
 * @Description:
 */

import { Box, Typography } from '@mui/material';
import { LineLayer } from 'deck.gl';
import { DeckGL } from 'deck.gl';
import { Map } from 'react-map-gl';

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibGVvZmx1dHRlciIsImEiOiJjamxxNzB0NnAyY2lmM3F0NTYzdzJucW5oIn0.dMUjz6viWO9EM5Gq73zYLQ';

const data = [{ sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }];
export const MapControl = (props) => {
  const layers = [new LineLayer({ id: 'line-layer', data })];
  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
      <Map mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
};
