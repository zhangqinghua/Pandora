'use strict';

const adsAdminController = require('../controller/manage/ads');
const adsApiController = require('../controller/api/ads');

module.exports = (options, app) => {
  return async function adsRouter(ctx, next) {
    const pluginConfig = app.config.doraAds;
    await app.initPluginRouter(
      ctx,
      pluginConfig,
      adsAdminController,
      adsApiController
    );
    await next();
  };
};
