'use strict';
const regUserAdminController = require('../controller/manage/regUser');
const regUserApiController = require('../controller/api/regUser');

module.exports = (options, app) => {
  return async function regUserRouter(ctx, next) {
    const pluginConfig = app.config.doraRegUser;
    await app.initPluginRouter(
      ctx,
      pluginConfig,
      regUserAdminController,
      regUserApiController
    );
    await next();
  };
};
