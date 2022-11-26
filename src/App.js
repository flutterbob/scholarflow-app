/*
 * @Author: yizheng
 * @Date: 2022-11-22 20:00:06
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-26 18:20:03
 * @FilePath: \5002Project\scholarflow-app\src\App.js
 * @Description:
 */
import './App.css';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { MapControl } from './layout/Map/mapControl';

// Source data GeoJSON
const DATA_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/arc/counties.json'; // eslint-disable-line
const CNKI_DATA_URL = 'http://localhost:3030/getCNKI';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => response.json())
      .then(({ features }) => {
        console.log('features', features);
        setData(features);
      });

    fetch(CNKI_DATA_URL, {
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        // Accept: 'application/json',
      },
    }).then((response) => console.log('response', response));
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
