/*
 * @Author: yizheng
 * @Date: 2022-11-26 15:32:03
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-28 21:43:57
 * @FilePath: \scholarflow-app\src\publicUtil\commonUtils.js
 * @Description:
 */

import { getGeocoding, getScholarData } from './data';

const uniqueArr = (arr) => {
  if (!Array.isArray(arr)) {
    console.log('not arr');
    return;
  }

  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) res.push(arr[i]);
  }
  return res;
};

export const getScholarInit = () => {
  let geoCode = getGeocoding();
  let scholarData = getScholarData();

  scholarData.map((item) => {
    let organs = item.Organ;
    organs = organs.map((organ) => {
      let index = geoCode.findIndex((it) => {
        return it.name === organ;
      });
      let obj = {};
      return geoCode[index];
    });

    let citys = [];
    let provinces = [];
    organs.map((organ) => {
      if (organ.city) {
        citys = [...citys, organ.city];
        provinces = [...provinces, organ.province];
      } else console.log('空值');
    });

    item.Organ = organs.map((item) => {
      let obj = {};
      obj.Id = item.Id;
      obj.name = item.name;
      obj.coordinate = [item.coordinate.longitude, item.coordinate.latitude];
      return obj;
    });
    item.OrganCount = organs.length;
    item.City = uniqueArr(citys).sort((a, b) => a < b);
    item.Province = uniqueArr(provinces).sort((a, b) => a < b);

    return item;
  });
  console.log(scholarData);
  return scholarData;
};

export const getScholarCityLink = () => {
  let initData = getScholarInit();

  //转换成city
  let citylist = [];
  let cityLinkList = [];
  initData.map((item) => {
    citylist = [...citylist, ...item.City];
    if (item.City.length > 1) {
      for (let i = 0; i < item.City.length - 1; i++) {
        for (let j = i + 1; j < item.City.length; j++) {
          cityLinkList.push(`${item.City[i]}-${item.City[j]}`);
        }
      }
    }
  });
  let cityObj = {};
  let cityLinkObj = {};
  citylist.map((item) => {
    let key = item;
    if (cityObj[key]) {
      cityObj[key]++;
    } else cityObj[key] = 1;
  });
  cityLinkList.map((item) => {
    let key = item;
    if (cityLinkObj[key]) cityLinkObj[key]++;
    else cityLinkObj[key] = 1;
  });

  let cityArr = [];
  let cityLinkArr = [];
  for (let i in cityObj) {
    let obj = {
      name: i,
      count: cityObj[i],
    };
    cityArr.push(obj);
  }
  for (let i in cityLinkObj) {
    let obj = {
      name: i,
      count: cityLinkObj[i],
    };
    cityLinkArr.push(obj);
  }

  console.log('cityArr', cityArr);
  console.log('citylinkArr', cityLinkArr);
};

export const getScholarProvinceLink = () => {
  let initData = getScholarInit();

  //转换成city
  let provincelist = [];
  let provinceLinkList = [];
  initData.map((item) => {
    provincelist = [...provincelist, ...item.Province];
    if (item.Province.length > 1) {
      for (let i = 0; i < item.Province.length - 1; i++) {
        for (let j = i + 1; j < item.Province.length; j++) {
          provinceLinkList.push(`${item.Province[i]}-${item.Province[j]}`);
        }
      }
    }
  });
  let provinceObj = {};
  let provinceLinkObj = {};
  provincelist.map((item) => {
    let key = item;
    if (provinceObj[key]) {
      provinceObj[key]++;
    } else provinceObj[key] = 1;
  });
  provinceLinkList.map((item) => {
    let key = item;
    if (provinceLinkObj[key]) provinceLinkObj[key]++;
    else provinceLinkObj[key] = 1;
  });

  let proList = [];
  for (let i in provinceObj) {
    let obj = {
      name: i,
      count: provinceObj[i],
    };
    proList.push(obj);
  }
  let proLinkList = [];
  for (let i in provinceLinkObj) {
    let obj = {
      name: i,
      count: provinceLinkObj[i],
    };
    proLinkList.push(obj);
  }

  console.log('provinceStatistic', proList);
  console.log('provincelinkStatitic', proLinkList);

  // console.log('linkArr', linkArr);
};
