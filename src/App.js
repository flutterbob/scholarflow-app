/*
 * @Author: yizheng
 * @Date: 2022-11-22 20:00:06
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-25 20:56:31
 * @FilePath: \scholarflow-app\src\App.js
 * @Description:
 */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { MapControl } from './layout/Map/mapControl';

// Source data GeoJSON
const DATA_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/arc/counties.json'; // eslint-disable-line

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => response.json())
      .then(({ features }) => {
        console.log('features', features);
        setData(features);
      });
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ m: 0, p: 2, width: '100%', height: '100%' }} aria-label="App-Box">
        {data && <MapControl data={data} />}
      </Box>
    </React.Fragment>
  );
}

export default App;
