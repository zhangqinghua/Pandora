/*
 * @Author: doramart
 * @Date: 2019-09-25 14:16:44
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-26 17:37:37
 */
'use strict';
const Core = require('@alicloud/pop-core');
const _ = require('lodash');
const siteFunc = {
  clearUserSensitiveInformation(targetObj) {
    targetObj.password && delete targetObj.password;
    targetObj.countryCode && delete targetObj.countryCode;
    targetObj.phoneNum && delete targetObj.phoneNum;
    targetObj.email && delete targetObj.email;
    targetObj.watchSpecials && delete targetObj.watchSpecials;
    targetObj.watchCommunity && delete targetObj.watchCommunity;
    targetObj.praiseCommunityContent && delete targetObj.praiseCommunityContent;
    targetObj.praiseMessages && delete targetObj.praiseMessages;
    targetObj.praiseContents && delete targetObj.praiseContents;
    targetObj.favoriteCommunityContent &&
      delete targetObj.favoriteCommunityContent;
    targetObj.favorites && delete targetObj.favorites;
    targetObj.despiseCommunityContent &&
      delete targetObj.despiseCommunityContent;
    targetObj.despiseMessage && delete targetObj.despiseMessage;
    targetObj.despises && delete targetObj.despises;
    targetObj.watchers && delete targetObj.watchers;
    targetObj.followers && delete targetObj.followers;
  },

  async addSiteMessage(
    type = '',
    activeUser = '',
    passiveUser = '',
    content = '',
    params = {
      targetMediaType: '0',
      recordId: '',
    }
  ) {
    try {
      const messageObj = {
        type,
        activeUser: activeUser.id,
        passiveUser,
        recordId: params.recordId,
        isRead: false,
      };

      if (params.targetMediaType === '0') {
        messageObj.content = content;
      } else if (params.targetMediaType === '1') {
        messageObj.message = content;
      } else if (params.targetMediaType === '2') {
        messageObj.communityContent = content;
      } else if (params.targetMediaType === '3') {
        messageObj.communityMessage = content;
      }

      // const {
      //     siteMessageService
      // } = require('@service');
      // await siteMessageService.create(messageObj);
    } catch (error) {
      // logUtil.error(error, {});
    }
  },

  randomString(len, charSet) {
    charSet =
      charSet ||
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  },

  // 验证码接口
  sendTellMessagesByPhoneNum(smsInfo, phoneNum, targetCode) {
    // send sms
    if (!_.isEmpty(smsInfo)) {
      const {
        accessKeyId,
        accessKeySecret,
        endpoint,
        apiVersion,
        TemplateCode,
        SignName,
      } = smsInfo;
      const client = new Core({
        accessKeyId,
        accessKeySecret,
        endpoint,
        apiVersion,
      });

      const params = {
        PhoneNumbers: phoneNum,
        SignName,
        TemplateCode,
        TemplateParam: '{"code":' + targetCode + '}',
      };

      const requestOption = {
        method: 'POST',
      };

      client.request('SendSms', params, requestOption).then(
        (result) => {
          console.log(JSON.stringify(result));
        },
        (ex) => {
          console.log(ex);
        }
      );
    } else {
      console.log('确实配置文件');
    }
  },
};
module.exports = siteFunc;
