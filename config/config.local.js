'use strict';
const path = require('path');

module.exports = (appInfo) => {
  return {
    admin_root_path: 'http://localhost',
    // DEV_CONFIG_MODULES_BEGIN
    dev_modules: [
      // 'navbar',
      // 'dashboard',
      // 'adminGroup',
      // 'adminUser',
      // 'adminResource',
      // 'systemConfig',
      // 'backUpData',
      // 'systemOptionLog',
      // 'announce',
      // 'systemNotify',
      // 'ads',
      // 'contentTemp',
      // 'templateConfig',
      // 'versionManage',
      // 'content',
      // 'contentTags',
      // 'contentCategory',
      // 'contentMessage',
      // 'regUser',
      // 'helpCenter',
      // 'renderCms',
      // 'cmsTemplate',
      // 'plugin',
      // 'uploadFile',
      // 'mailTemplate',
      // 'mailDelivery',
      // 'valine',
      // 'hook',
    ],
    // DEV_CONFIG_MODULES_END
    sqlPath: {
      bin: '/usr/local/mysql/bin/',
      backup: path.join(appInfo.baseDir, 'databak/'),
    },
    // 配置mysql信息
    sequelize: {
      dialect: 'mariadb',
      host: 'hk-cdb-hbgfyvc9.sql.tencentcdb.com', // 本地
      port: 63985, // 本地
      database: 'talkai', // mysql database dir
      username: 'root',
      password: 'Qw385613',
      delegate: 'model',
    },
    static: {
      prefix: '/static',
      dir: [
        path.join(appInfo.baseDir, 'app/public'),
        path.join(appInfo.baseDir, 'backstage/dist'),
      ],
      maxAge: 31536000,
    },
    logger: {
      dir: path.join(appInfo.baseDir, 'logs'),
    },
    server_path: 'http://127.0.0.1:10003',
  };
};
