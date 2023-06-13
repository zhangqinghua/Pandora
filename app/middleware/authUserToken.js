/*
 * @Author: doramart
 * @Date: 2019-08-16 14:51:46
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-21 21:59:02
 */
'use strict';
const { authToken } = require('@utils');
const _ = require('lodash');
module.exports = (options, app) => {
  return async function authUserToken(ctx, next) {
    try {
      ctx.session.user = '';
      let userToken = '';
      const getTokenFromCookie = ctx.cookies.get(
        'api_' + app.config.auth_cookie_name
      );

      if (ctx.request.method === 'GET') {
        userToken = ctx.query.token || getTokenFromCookie;
      } else if (ctx.request.method === 'POST') {
        userToken = ctx.request.body.token || getTokenFromCookie;
      }

      if (userToken) {
        const checkToken = await authToken.checkToken(
          userToken,
          app.config.encrypt_key
        );
        if (checkToken) {
          if (typeof checkToken === 'object') {
            const targetUser = await ctx.service.user.item({
              query: {
                id: checkToken.userId,
              },
              attributes: ['id', 'userName', 'email'],
            });
            if (!_.isEmpty(targetUser)) {
              const { _id, id, userName, email, logo } = targetUser;
              ctx.session.user = {
                _id,
                id,
                userName,
                email,
                logo,
              };
              ctx.session.user.token = userToken;
              ctx.session.logined = true;
            }
          }
        }
      }

      await next();
    } catch (error) {
      ctx.helper.renderFail(ctx, {
        message: `${error.message}`,
      });
    }
  };
};
