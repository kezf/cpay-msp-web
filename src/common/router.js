import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/home/index': {
      component: dynamicWrapper(app, ['chart', 'home'], () => import('../routes/home/Home')),
    },
    //商户管理
    '/merchant/merchantOpen': {
      component: dynamicWrapper(app, [], () => import('../routes/merchant/open/Basic')),
    },
    '/merchant/merchantOpen/list': {
      component: dynamicWrapper(app, ['merchant'], () => import('../routes/merchant/open/List')),
    },
    '/merchant/merchantOpen/view/:id': {
      component: dynamicWrapper(app, ['merchant','terminal'], (id) => import('../routes/merchant/open/View')),
    },
    '/merchant/merchantOpen/edit/:id': {
      component: dynamicWrapper(app, ['merchant'], (id) => import('../routes/merchant/open/Edit')),
    },
    '/merchant/merchantOpen/add': {
      component: dynamicWrapper(app, ['merchant'], (id) => import('../routes/merchant/Add')),
    },
    '/merchant/merchantOpen/add/type': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/merchant/Add/Step1')),
    },
    '/merchant/merchantOpen/add/info': {
      component: dynamicWrapper(app, ['form','citys','merchant'], () => import('../routes/merchant/Add/Step2')),
    },
    '/merchant/merchantOpen/add/confirm': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/merchant/Add/Step3')),
    },
    '/merchant/merchantOpen/add/result': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/merchant/Add/Step4')),
    },
    '/merchant/merchantInfo': {
      component: dynamicWrapper(app, [], () => import('../routes/merchant/info/Basic')),
    },
    '/merchant/merchantInfo/list': {
      component: dynamicWrapper(app, ['merchant'], () => import('../routes/merchant/info/List')),
    },
    '/merchant/merchantInfo/view/:id': {
      component: dynamicWrapper(app, ['merchant','terminal'], (id) => import('../routes/merchant/open/View')),
    },
    '/merchant/merchantInfo/edit/:id': {
      component: dynamicWrapper(app, ['merchant','citys'], (id) => import('../routes/merchant/open/Edit')),
    },
    '/merchant/review': {
      component: dynamicWrapper(app, [], () => import('../routes/merchant/review/Basic')),
    },
    '/merchant/review/list': {
      component: dynamicWrapper(app, ['merchant'], () => import('../routes/merchant/review/List')),
    },
    '/merchant/review/view/:id': {
      component: dynamicWrapper(app, ['merchant','user'], (id) => import('../routes/merchant/review/View')),
    },
    //门店管理
    '/store': {
      component: dynamicWrapper(app, [], () => import('../routes/store/store/Store')),
    },
    '/store/list': {
      component: dynamicWrapper(app, ['store'], () => import('../routes/store/store/List')),
    },
    '/store/edit/:id': {
      component: dynamicWrapper(app, ['store','merchant','citys'], () => import('../routes/store/store/Edit')),
    },
    '/store/cashier/:id': {
      component: dynamicWrapper(app, ['store'], () => import('../routes/store/store/Cashier')),
    },
    '/store/bindMp/:id': {
      component: dynamicWrapper(app, ['store'], () => import('../routes/store/store/BindMp')),
    },
    '/store/view/:id': {
      component: dynamicWrapper(app, ['store'], () => import('../routes/store/store/View')),
    },
    //收银管理
    '/transition/flow': {
      component: dynamicWrapper(app, ['transition'], () => import('../routes/transition/flow/List')),
    },
    '/transition/summary': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/transition/summary/List')),
    },
    '/transition/poundage': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/transition/poundage/List')),
    },
    '/transition/billCheck': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/transition/billCheck/List')),
    },
    //系统管理
    '/system/institution': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/system/institutiontree/List')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
