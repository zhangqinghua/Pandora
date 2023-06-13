/*
 * @Author: doramart
 * @Date: 2019-06-24 13:20:49
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 17:37:00
 */

'use strict';
const Service = require('egg').Service;
const path = require('path');
const _ = require('lodash');

// general是一个公共库，可用可不用
const {
  _list,
  _item,
  _count,
  _create,
  _update,
  _removes,
  _safeDelete,
  _addToSet,
  _pull,
} = require(path.join(process.cwd(), 'app/service/general'));

class UserPraiseContentService extends Service {
  async find(
    payload = {},
    { query = {}, searchKeys = [], include = [], attributes = null } = {}
  ) {
    const listdata = _list(this, this.ctx.model.UserPraiseContent, payload, {
      query,
      searchKeys: !_.isEmpty(searchKeys) ? searchKeys : [],
      include: !_.isEmpty(include) ? include : [],
      attributes: attributes
        ? attributes
        : {
            exclude: ['password'],
          },
    });
    return listdata;
  }

  async count(params = {}) {
    return _count(this, this.ctx.model.UserPraiseContent, params);
  }

  async create(payload) {
    return _create(this, this.ctx.model.UserPraiseContent, payload);
  }

  async removes(values, key = 'id') {
    return _removes(this, this.ctx.model.UserPraiseContent, values, key);
  }

  async safeDelete(values) {
    return _safeDelete(this, this.ctx.model.UserPraiseContent, values);
  }

  async update(id, payload) {
    return _update(this, this.ctx.model.UserPraiseContent, id, payload);
  }

  async addToSet(res, id, payload) {
    return _addToSet(res, this.ctx.model.UserPraiseContent, id, payload);
  }

  async pull(res, id, payload) {
    return _pull(res, this.ctx.model.UserPraiseContent, id, payload);
  }

  async item({ query = {}, include = [], attributes = null } = {}) {
    return _item(this, this.ctx.model.UserPraiseContent, {
      query,
      include: !_.isEmpty(include) ? include : [],
      attributes: attributes ? attributes : {},
    });
  }
}

module.exports = UserPraiseContentService;
