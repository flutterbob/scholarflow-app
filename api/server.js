/*
 * @Author: yizheng
 * @Date: 2022-11-26 16:24:56
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-26 22:16:44
 * @FilePath: \5002Project\scholarflow-app\api\server.js
 * @Description:
 */

import axios from 'axios';
import express from 'express';
import fs from 'fs';
const app = express();
app.use(express.json());

let CNKI_DATA_JSON;

const Baidu_Map_Service_AccessToken = '1dWBStYxbAzIwY9Gn4eD2op51CCgDfDz';

/**
 * 初始化数据
 * @returns
 */
const initialData = () => {
  const data = fs.readFileSync('dataset/CNKI.txt', 'UTF-8');

  // split the contens by new line
  const lines = data.split(/\r?\n/);
  let newline = lines.map((line) => line.replace('  ', ''));
  let indexArr = [-1];
  newline.map((line, index) => {
    if (line === '') indexArr = [...indexArr, index];
  });
  let result = [];
  for (let i = 0; i < indexArr.length - 1; i++) {
    result.push(newline.slice(indexArr[i] + 1, indexArr[i + 1] - 1));
  }
  result = result.map((arr) => {
    let cnkiObj = new Object();
    arr.map((obj, index) => {
      let keyValue = obj.split(':');
      cnkiObj.Id = index + 1;
      switch (keyValue[0]) {
        case 'SrcDatabase-来源库':
          cnkiObj.SrcDatabase = keyValue[1];
          break;
        case 'Title-题名':
          cnkiObj.Title = keyValue[1];
          break;
        case 'Author-作者':
          cnkiObj.Author = keyValue[1].split(';').filter(Boolean);
          break;
        case 'Organ-单位':
          cnkiObj.Organ = keyValue[1].split(';').filter(Boolean);
          break;
        case 'Source-文献来源':
          cnkiObj.Source = keyValue[1];
          break;
        default:
          break;
      }
    });
    return cnkiObj;
  });

  let resultStr = JSON.stringify(result, '', '\t');
  fs.writeFileSync('dataset/data.json', resultStr, (err) => {
    console.log(err);
  });
};

const readJSON = () => {
  const data = fs.readFileSync('dataset/data.json', 'utf-8');
  const dataJSON = JSON.parse(data);
  let organJson = [];
  console.log(dataJSON.length);
  let newDataJSON = dataJSON.map((data, index) => {
    data.Organ.map((organ) => {
      organJson = [...organJson, organ];
    });
    data.Id = index + 1;
    return data;
  });
  writeJSON('data.json', newDataJSON);
  console.log('organ1Arr', organJson.length);
  //去重复
  organJson = organJson.filter((item, index, arr) => {
    return arr.indexOf(item, 0) === index;
  });
  organJson = organJson.map((item, index) => {
    let obj = {};
    obj.Id = index + 1;
    obj.name = item;
    obj.coordinate = {
      longitude: 0,
      latitude: 0,
    };
    obj.city = '';
    return obj;
  });
  writeJSON('address.json', organJson);

  // 创建link对象
  let linkArr = [];
  newDataJSON.map((item) => {
    let link = {};
    let organArr = item.Organ;
  });
};

const writeJSON = (fileName, data) => {
  let resultStr = JSON.stringify(data, '', '\t');
  fs.writeFileSync(`dataset/${fileName}`, resultStr, (err) => {
    console.log(err);
  });
};

// const statisticCity = () => {
//   if (!CNKI_DATA_JSON) return;
//   let result = CNKI_DATA_JSON.filter((data) => data.Organ.length > 1);
//   console.log('Total count', CNKI_DATA_JSON.length);
//   console.log('Results count', result.length);

//   for (let i = 0; i < result.length; i++) {
//     let paperObj = result[i];
//     let organArr = paperObj.Organ;
//     paperObj.coordinateArr = [];
//     // let fetchUrl = `https://api.map.baidu.com/geocoding/v3/?address=${organArr[i]}&output=json&ak=${Baidu_Map_Service_AccessToken}&callback=showLocation`;
//     let requestArr = organArr.map((organ) => {
//       let fetchUrl = `https://api.map.baidu.com/geocoding/v3/?address=${organ}&output=json&ak=${Baidu_Map_Service_AccessToken}&callback=showLocation`;
//       return axios.get(fetchUrl);
//     });
//     Promise.all(requestArr).then((reqDataArr, index) => {
//       paperObj.coordinateArr = [...paperObj.coordinateArr, reqDataArr];
//       console.log(`${index}`, reqDataArr);
//     });
//     // console.log(paperObj);
//     // let lnglatArr = organArr.map((req) => axios.get(fetchUrl));
//     // Promise.all(lnglatArr).then((resDataArr) => {
//     //   console.log(resDataArr);
//     // });
//     //   for (let j = 0; j < organArr.length; j++) {
//   }

//   //   }
//   // }
//   // result = CNKI_DATA_JSON.map((paperObj) => {
//   //   let organLocation = [];
//   //   if (!paperObj.Organ) return paperObj;
//   //   organLocation = paperObj.Organ.map((organ) => {
//   //     // console.log(organ);
//   //     // return organ;
//   //     let fetchUrl = `https://api.map.baidu.com/geocoding/v3/?address=${organ}&output=json&ak=${Baidu_Map_Service_AccessToken}&callback=showLocation`;
//   //     axios.get(fetchUrl).then((res) => {
//   //       return res;
//   //     });
//   //   });
//   //   return organLocation;
//   // });
//   // console.log(result);
// };

app.get('/', (req, res) => {
  res.send("It's working!");
  readJSON();

  console.log("It's working");
});

app.get('/getCNKI', (req, res) => {
  try {
    // read contents of the file
    res.send(CNKI_DATA_JSON);
    console.log(CNKI_DATA_JSON);
  } catch (err) {
    console.log(err);
  }
});

// app.get('/getCityStatisticInfo', (req, res) => {
//   statisticCity();
// });

app.listen(3030, () => {
  // initialData();
  // CNKI_DATA_JSON = initialData();
  console.log('app listening on port 3030');
});
