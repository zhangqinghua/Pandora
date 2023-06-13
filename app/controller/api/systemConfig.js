/*
 * @Author: doramart
 * @Date: 2019-07-07 13:07:27
 * @Last Modified by: doramart
 * @Last Modified time: 2021-04-05 22:03:29
 */
'use strict';
const Controller = require('egg').Controller;

class SystemConfigController extends Controller {
  async list() {
    const ctx = this.ctx;
    const systemConfigList = await ctx.service.systemConfig.find(
      {
        isPaging: '0',
      },
      {
        attributes: [
          'siteName',
          'ogTitle',
          'siteDomain',
          'siteDiscription',
          'siteKeywords',
          'siteAltKeywords',
          'registrationNo',
          'showImgCode',
          'statisticalCode',
          'siteLogo',
          'editorType',
        ],
      }
    );
    ctx.helper.renderSuccess(ctx, {
      data: systemConfigList[0],
    });
  }
}

module.exports = SystemConfigController;
