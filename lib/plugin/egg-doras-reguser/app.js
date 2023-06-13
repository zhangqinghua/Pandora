'use strict';
const path = require('path');
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  beforeStart() {}

  configWillLoad() {
    this.app.config.middleware.push('regUserRouter');
  }

  async didLoad() {
    // 数据模型初始化
    const modelsPath = path.resolve(__dirname, './app/model');
    this.app.initExtendModel(modelsPath);
  }
}

module.exports = AppBootHook;
