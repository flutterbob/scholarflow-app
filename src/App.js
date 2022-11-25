/*
 * @Author: yizheng
 * @Date: 2022-11-22 20:00:06
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-22 20:07:47
 * @FilePath: /scholarflow-app/src/App.js
 * @Description:
 */
import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Box } from '@mui/system';
import { MapControl } from './layout/Map/mapControl';

function App() {
  return (
    <React.Fragment>
      <Box sx={{ m: 0, p: 2 }}>
        <MapControl/>
      </Box>
    </React.Fragment>
  );
}

export default App;
