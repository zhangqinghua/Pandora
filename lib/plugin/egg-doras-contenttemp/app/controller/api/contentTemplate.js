/*
 * @Author: doramart
 * @Date: 2019-09-23 14:44:21
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 17:47:44
 */
'use strict';
const _ = require('lodash');

const ContentTemplateController = {
  async getDefaultTempInfo(ctx, app) {
    const defaultTempData = app.cache.get(
      app.config.session_secret + '_default_temp'
    );
    if (!_.isEmpty(defaultTempData)) {
      console.log('get cache template');
      ctx.helper.renderSuccess(ctx, {
        data: defaultTempData,
      });
    } else {
      const defaultTemp = await ctx.service.contentTemplate.item({
        query: {
          using: true,
        },
        include: [
          {
            as: 'items',
            model: 'TemplateItems',
          },
        ],
      });
      if (!_.isEmpty(defaultTemp)) {
        // 缓存1天
        ctx.helper.setMemoryCache(
          app.config.session_secret + '_default_temp',
          defaultTemp,
          1000 * 60 * 60 * 24
        );
        ctx.helper.renderSuccess(ctx, {
          data: defaultTemp,
        });
      } else {
        ctx.helper.renderSuccess(ctx, {
          data: {},
        });
      }
    }
  },
};

module.exports = ContentTemplateController;
