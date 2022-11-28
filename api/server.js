/*
 * @Author: yizheng
 * @Date: 2022-11-26 16:24:56
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-28 22:13:58
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
const geocoding =
  'https://api.map.baidu.com/geocoding/v3/?address=新疆大学新疆绿洲生态重点实验室&output=json&ak=1dWBStYxbAzIwY9Gn4eD2op51CCgDfDz&callback=showLocation';
const geocodingSample =
  'showLocation&&showLocation({"status":0,"result":{"location":{"lng":120.31054587921658,"lat":30.250732150051844},"precise":0,"confidence":50,"comprehension":0,"level":"NoClass"}})';
const reverseGeocoding =
  'https://api.map.baidu.com/reverse_geocoding/v3/?ak=您的ak&output=json&coordtype=wgs84ll&location=31.225696563611,121.49884033194';

const GAODE_KEY = 'bc7eb054ee9d30f0cbf57f3fbb2eb16c';
const GAODE_GEOCODING_API = '';

/**
 * 初始化数据
 * @returns
 */
const initialData = (res) => {
  const data = fs.readFileSync('dataset/Year/2019.txt', 'UTF-8');

  // split the contens by new line
  const lines = data.split(/\r?\n/);
  let newline = lines.map((line) => line.replace('  ', ''));
  let indexArr = [-1];
  newline.map((line, index) => {
    if (line === '') indexArr = [...indexArr, index];
  });
  // console.log('indexArr', indexArr);
  let result = [];
  for (let i = 0; i < indexArr.length - 1; i++) {
    result.push(newline.slice(indexArr[i] + 1, indexArr[i + 1]));
  }
  res.send(result);

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
        case 'Keyword-关键词':
          cnkiObj.Keywords = keyValue[1].split(';').filter(Boolean);
          break;
        case 'Year-年':
          cnkiObj.Year = keyValue[1];
          break;
        default:
          break;
      }
    });
    return cnkiObj;
  });

  let resultStr = JSON.stringify(result, '', '\t');
  fs.writeFileSync('dataset/Year/2019.json', resultStr, (err) => {
    console.log(err);
  });
};

const combineJSON = (res) => {
  const data2018 = fs.readFileSync('dataset/Year/2018.json', 'utf-8');
  const data2019 = fs.readFileSync('dataset/Year/2019.json', 'utf-8');
  const data2020 = fs.readFileSync('dataset/Year/2020.json', 'utf-8');
  const data2021 = fs.readFileSync('dataset/Year/2021.json', 'utf-8');
  const data2022 = fs.readFileSync('dataset/Year/2022.json', 'utf-8');
  const json2018 = JSON.parse(data2018);
  const json2019 = JSON.parse(data2019);
  const json2020 = JSON.parse(data2020);
  const json2021 = JSON.parse(data2021);
  const json2022 = JSON.parse(data2022);
  const dataJson = [...json2018, ...json2019, ...json2020, ...json2021, ...json2022];
  let newDataJson = dataJson.map((item, index) => {
    let obj = item;
    obj.Id = index + 1;
    return obj;
  });

  let resultStr = JSON.stringify(newDataJson, '', '\t');
  fs.writeFileSync('dataset/data.json', resultStr, (err) => {
    console.log(err);
  });
  res.send(dataJson);
};

const readJSON = (res) => {
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
  res.send(organJson);
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

async function fetchBaiduApi(qps) {
  const addressData = fs.readFileSync('dataset/address.json', 'utf-8');
  let addressJSON = JSON.parse(addressData);
  // addressJSON = addressJSON.slice(0, 10);
  let fetchArr = [];
  const dataSample = {
    status: 0,
    result: {
      location: { lng: 108.0782900159344, lat: 34.26537101201229 },
      precise: 0,
      confidence: 70,
      comprehension: 0,
      level: '教育',
    },
  };
  for (let i = 0; i < addressJSON.length; i++) {
    fetchArr.push(
      axios
        .get(
          `https://api.map.baidu.com/geocoding/v3/?address=${addressJSON[i].name}&output=json&ak=1dWBStYxbAzIwY9Gn4eD2op51CCgDfDz`
        )
        .then((req) => {
          let obj = addressJSON[i];
          if (req.data.status === 0) obj.coordinate = req.data.result.location;
          return obj;
        })
        .catch((err) => console.log('error', err))
    );
    if (i % qps === 0)
      await new Promise(
        (r) =>
          setTimeout(() => {
            r();
          }),
        1000
      );
  }

  let result = await Promise.all(fetchArr);
  console.log('result', result);
  writeJSON('addressLngLat2.json', result);
  console.log('success');
}

async function fetchGaodeGeocodingApi(res, qps) {
  const addressData = fs.readFileSync('dataset/addressLngLat2.json', 'utf-8');
  let addressJSON = JSON.parse(addressData);
  let start = 600;
  let end = 650;
  let filename = 'addressLngLatGaode12P5.json';
  addressJSON = addressJSON.slice(start, end);
  let fetchArr = [];
  // addressJSON = addressJSON.filter((item) => {
  //   return item.coordinate.latitude === 0 && item.coordinate.longitude === 0;
  // });
  // res.send(addressJSON);
  const req = {
    status: '1',
    info: 'OK',
    infocode: '10000',
    count: '1',
    geocodes: [
      {
        formatted_address: '四川省成都市武侯区中国长江电力股份有限公司',
        country: '中国',
        province: '四川省',
        citycode: '028',
        city: '成都市',
        district: '武侯区',
        township: [],
        neighborhood: { name: [], type: [] },
        building: { name: [], type: [] },
        adcode: '510107',
        street: [],
        number: [],
        location: '104.069703,30.589319',
        level: '兴趣点',
      },
    ],
  };

  for (let i = 0; i < addressJSON.length; i++) {
    fetchArr.push(
      axios
        .get(`https://restapi.amap.com/v3/geocode/geo?key=${GAODE_KEY}&address=${addressJSON[i].name}`)
        .then((req) => {
          let obj = addressJSON[i];
          console.log('请求次数：', i);
          if (req.data.status === '1') {
            // obj.coordinate = req.data.result.location;
            obj.city = req.data.geocodes[0].city;
            obj.province = req.data.geocodes[0].province;
            obj.district = req.data.geocodes[0].district;
            obj.coordinate.longitude = req.data.geocodes[0].location.split(',')[0];
            obj.coordinate.latitude = req.data.geocodes[0].location.split(',')[1];
          } else {
            obj.city = '';
            obj.province = '';
            obj.district = '';
          }
          return obj;
        })
        .catch((err) => console.log('error', err))
    );
    if (i % qps === 0)
      await new Promise(
        (r) =>
          setTimeout(() => {
            r();
          }),
        1000
      );
  }

  let result = await Promise.all(fetchArr);
  writeJSON(filename, result);

  // console.log('result', result);
  let resulatAll = fs.readFileSync('dataset/city.json', 'utf-8');
  resulatAll = JSON.parse(resulatAll);
  resulatAll = [...resulatAll, ...result];
  writeJSON('addressLngLatGaode.json', resulatAll);
  console.log('success');
}

async function fetchGaodeGeocodingApiForCity(res, qps) {
  const addressData = fs.readFileSync('dataset/city.json', 'utf-8');
  let addressJSON = JSON.parse(addressData);
  let start = 0;
  let end = 50;
  let filename = 'city1.json';
  addressJSON = addressJSON.slice(start, end);
  let fetchArr = [];
  console.log(addressJSON.length);

  for (let i = 0; i < addressJSON.length; i++) {
    fetchArr.push(
      axios
        .get(`https://restapi.amap.com/v3/geocode/geo?key=${GAODE_KEY}&address=${addressJSON[i].name}`)
        .then((req) => {
          let obj = addressJSON[i];
          console.log('请求索引：', i);
          if (req.data.status === '1') {
            // obj.coordinate = req.data.result.location;
            obj.coordinate = [
              parseFloat(req.data.geocodes[0].location.split(',')[0]),
              parseFloat(req.data.geocodes[0].location.split(',')[1]),
            ];
          } else {
            obj.coordinate = [0, 0];
          }
          return obj;
        })
        .catch((err) => console.log('error', err))
    );
    if (i % qps === 0)
      await new Promise(
        (r) =>
          setTimeout(() => {
            r();
          }),
        1000
      );
  }

  let result = await Promise.all(fetchArr);
  writeJSON(filename, result);

  // console.log('result', result);
  let resulatAll = fs.readFileSync('dataset/cityGeocode.json', 'utf-8');
  resulatAll = JSON.parse(resulatAll);
  resulatAll = [...resulatAll, ...result];
  writeJSON('cityGeocode.json', resulatAll);
  console.log('success');
}

app.get('/', (req, res) => {
  // let resultJSON = fs.readFileSync('dataset/addressLngLatGaode.json', 'utf-8');
  // resultJSON = JSON.parse(resultJSON);
  // // res.send(resultJSON);
  // let newResultJSON = resultJSON.map((item) => {
  //   let obj = item;
  //   if (typeof obj.coordinate.longitude === 'string') {
  //     obj.coordinate.longitude = parseFloat(obj.coordinate.longitude);
  //     obj.coordinate.latitude = parseFloat(obj.coordinate.latitude);
  //   }
  //   return obj;
  // });
  // writeJSON('geocoding.json', newResultJSON);
  // let length = resultJSON.length;
  // console.log('length', length);
  // res.send(newResultJSON);
  fetchGaodeGeocodingApiForCity(res, 20);
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
  console.log('app listening on port 3030');
});
