/*
 * @Author: doramart
 * @Date: 2019-08-16 14:51:46
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 21:59:42
 */
'use strict';

module.exports = () => {
  return async function crossHeader(ctx, next) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
    );
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method === 'OPTIONS') {
      ctx.body = 200;
    } else {
      await next();
    }
  };
};
