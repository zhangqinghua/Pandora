/*
 * @Author: doramart
 * @Date: 2019-06-24 13:20:49
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-22 23:39:38
 */

'use strict';
const Service = require('egg').Service;

const {
  _list,
  _item,
  _count,
  _create,
  _update,
  _removes,
  _safeDelete,
} = require('./general');

class AdminResourceService extends Service {
  async find(
    payload = {},
    { query = {}, searchKeys = [], include = [], attributes = null } = {}
  ) {
    const listdata = _list(this, this.ctx.model.AdminResource, payload, {
      query,
      searchKeys,
      include,
      attributes,
      sort: [['sort_id', 'asc']],
    });
    return listdata;
  }

  async count(params = {}) {
    return _count(this, this.ctx.model.AdminResource, params);
  }

  async create(payload) {
    return _create(this, this.ctx.model.AdminResource, payload);
  }

  async removes(values, key = 'id') {
    return _removes(this, this.ctx.model.AdminResource, values, key);
  }

  async safeDelete(values) {
    return _safeDelete(this, this.ctx.model.AdminResource, values);
  }

  async update(id, payload) {
    return _update(this, this.ctx.model.AdminResource, id, payload);
  }

  async item(params = {}) {
    return _item(this, this.ctx.model.AdminResource, params);
  }
}

module.exports = AdminResourceService;
