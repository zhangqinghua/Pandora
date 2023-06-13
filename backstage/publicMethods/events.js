import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import request from '@root/publicMethods/request';
function _changeSideBar(that) {
  let sidebarStatus = Cookies.get('sidebarStatus');
  that.sidebarOpened = sidebarStatus == '1' ? true : false;
  if (that.sidebar) {
    that.sidebar.opened = that.sidebarOpened;
  }
}

export function initEvent(that) {
  let rootVm = that.$root;

  setTimeout(() => {
    _changeSideBar(that);
  }, 500);

  if (rootVm && rootVm.eventBus) {
    // 左侧菜单切换
    rootVm.eventBus.$on('toggleSideBar', (message) => {
      setTimeout(() => {
        _changeSideBar(that);
      }, 500);
    });
    // 屏幕大小切换
    rootVm.eventBus.$on('toggleDevice', (message) => {
      that.device = message;
    });

    rootVm.eventBus.$on('handleTabInfo', (message) => {
      if (!isEmpty(message)) {
        rootVm.eventBus.$emit('globalTabsChange', message);
      }
    });
  }

  // 修改移动端标记
  const { body } = document;
  const WIDTH = 992;
  const rect = body.getBoundingClientRect();
  that.device = rect.width - 1 < WIDTH ? 'mobile' : 'desktop';
  // 初始化后台配置
  const params = {};
  request({
    url: '/api/systemConfig/getConfig',
    params,
    method: 'get',
  }).then((result) => {
    if (result.status === 200) {
      that.appConfig = result.data;
    }
  });
}
