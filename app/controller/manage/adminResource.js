/*
 * @Author: doramart
 * @Date: 2019-06-20 18:55:40
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 22:13:54
 */
'use strict';
const Controller = require('egg').Controller;
const { adminResourceRule } = require('@validate');
const _ = require('lodash');
const { siteFunc } = require('@utils');

class AdminResourceController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const payload = ctx.query;
      _.assign(payload, {
        pageSize: 1000,
      });
      const adminResourceList = await ctx.service.adminResource.find(payload);

      ctx.helper.renderSuccess(ctx, {
        data: adminResourceList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async listByPower() {
    const { ctx } = this;
    try {
      const payload = {
        isPaging: '0',
      };
      _.assign(payload, {
        pageSize: 1000,
      });
      const manageCates = await ctx.service.adminResource.find(payload, {
        attributes: [
          'api',
          'id',
          'label',
          'enable',
          'routePath',
          'parentId',
          'source_type',
          'icon',
          'comments',
        ],
      });

      // console.log('--manageCates--', manageCates)
      const adminPower = await ctx.helper.getAdminPower(ctx);
      const currentCates = await siteFunc.renderNoPowerMenus(
        manageCates,
        adminPower
      );

      ctx.helper.renderSuccess(ctx, {
        data: currentCates,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async alllist() {
    const { ctx } = this;
    return await ctx.service.adminResource.find(
      {
        isPaging: '0',
      },
      {
        type: '1',
      }
    );
  }

  async create() {
    const { ctx } = this;
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        label: fields.label,
        source_type: fields.source_type,
        api: fields.api,
        parentId: fields.parentId,
        sortId: fields.sortId,
        routePath: fields.routePath,
        icon: fields.icon,
        componentPath: fields.componentPath,
        enable: fields.enable,
        comments: fields.comments,
      };

      ctx.validate(adminResourceRule.form(ctx), formObj);

      if (fields.type === '0' && !fields.label) {
        formObj.label = fields.routePath;
      }

      await ctx.service.adminResource.create(formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async getOne() {
    const { ctx } = this;
    try {
      const id = ctx.query.id;

      const targetItem = await ctx.service.adminResource.item({
        query: {
          id,
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: targetItem,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async update() {
    const { ctx } = this;
    try {
      const fields = ctx.request.body || {};
      const formObj = {
        label: fields.label,
        source_type: fields.source_type,
        api: fields.api,
        parentId: fields.parentId,
        sortId: fields.sortId,
        routePath: fields.routePath,
        icon: fields.icon,
        componentPath: fields.componentPath,
        enable: fields.enable,
        comments: fields.comments,
      };

      ctx.validate(adminResourceRule.form(ctx), formObj);

      let oldResource;
      if (fields.type === '0') {
        oldResource = await ctx.service.adminResource.item({
          query: {
            label: fields.label,
          },
        });
      } else {
        oldResource = await ctx.service.adminResource.item({
          query: {
            parentId: fields.parentId,
            comments: fields.comments,
          },
        });
      }

      if (!_.isEmpty(oldResource) && oldResource.id !== fields.id) {
        throw new Error(
          ctx.__('user_action_tips_repeat', [ctx.__('label_resourceName')])
        );
      }

      await ctx.service.adminResource.update(fields.id, formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async updateParentId() {
    const { ctx } = this;

    try {
      const fields = ctx.request.body || {};

      const formObj = {
        parentId: fields.parentId,
      };

      const oldResource = await ctx.service.adminResource.item({
        query: {
          label: fields.label,
        },
      });

      if (!_.isEmpty(oldResource) && oldResource.id !== fields.id) {
        throw new Error(
          ctx.__('user_action_tips_repeat', [ctx.__('label_resourceName')])
        );
      }

      await ctx.service.adminResource.update(fields.id, formObj);

      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }

  async removes() {
    const { ctx } = this;
    try {
      const targetIds = ctx.query.ids;
      // 删除主类
      await ctx.service.adminResource.removes(targetIds);
      // 删除子类
      await ctx.service.adminResource.removes(targetIds, 'parentId');
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  }
}

module.exports = AdminResourceController;
