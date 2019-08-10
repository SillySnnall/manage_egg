/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    // 阿里云node监控
    alinode: {
      enable: true, // 上线时开启
      appid: '81048',
      secret: '5c4fc9372dbb0790af973ec25fa2cd1a432679ef',
    },
    // 端口配置
    cluster: {
      listen: {
        port: 80,
        hostname: '0.0.0.0',// 服务器地址
        // path: '/var/run/egg.sock',
      }
    },

    // 阿里安全校验
    security: {
      csrf: {
        enable: false,
      },
    },
    // 数据库
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: 'silly@123',
        // 数据库名
        database: 'manage',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    // 跨域问题
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    },
    static: {
      prefix: '/',
      dir: ["app/public/"],
      dynamic: true,
      preload: false,
      maxAge: 0,
      buffer: false
    }
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1564381706172_7219';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  return {
    ...config,
    ...userConfig,
  };
};