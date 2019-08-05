'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // 数据库
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  // 跨域问题
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  alinode: {
    enable: true,
    package: 'egg-alinode',
  },
};