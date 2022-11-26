/*
 * @Author: yizheng
 * @Date: 2022-11-26 15:32:03
 * @LastEditor: yizheng
 * @LastEditTime: 2022-11-26 15:54:50
 * @FilePath: \scholarflow-app\src\publicUtil\commonUtils.js
 * @Description:
 */

import * as fs from 'fs';

export const fileReader = (filePath) => {
  const files = fs.readdirSync('./');
  console.log(files);
  //   let reader = new FileReader();
  //   reader.readAsText(filePath, 'utf-8');
  //   reader.onload = () => {
  //     console.log(reader.result);
  //   };
  //   reader.onerror = () => {
  //     console.log('读取失败');
  //     console.log(reader.onerror);
  //   };
};
