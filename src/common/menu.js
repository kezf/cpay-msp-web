const menuData = [{
  name: '首页',
  icon: 'home',
  path: 'home/index'
},{
  name: '商户管理',
  icon: 'dashboard',
  path: 'merchant',
  children: [{
    name: '商户开户申请',
    path: 'merchantOpen',
  }/*, {
    name: '商户信息列表',
    path: 'merchantInfo',
  }, {
    name: '待审核列表',
    path: 'review',
  }],
},{
  name: '门店管理',
  icon: 'dashboard',
  path: 'store',
  children: [{
    name: '门店列表',
    path: 'list',
  }*/],
}/*,{
  name: '收银管理',
  icon: 'dashboard',
  path: 'transition',
  children: [{
    name: '交易明细查询',
    path: 'flow',
  },{
    name: '交易汇总查询',
    path: 'summary',
  },{
    name: '手续费汇总查询',
    path: 'poundage',
  },{
    name: '交易对账',
    path: 'billCheck',
  }],
},{
  name: '终端管理',
  icon: 'dashboard',
  path: 'terminal',
  children: [{
    name: '终端列表',
    path: 'list',
  }],
},{
  name: '系统管理',
  icon: 'dashboard',
  path: 'system',
  children: [{
    name: '机构管理',
    path: 'carrier',
  },{
    name: '渠道商管理',
    path: 'institution',
  },{
    name: '用户管理',
    path: 'user',
  },{
    name: '商户鉴权查询',
    path: 'authentication',
  },{
    name: '角色管理',
    path: 'role',
  },{
    name: '菜单管理',
    path: 'menutree',
  },{
    name: '字典管理',
    path: 'dict',
  },{
    name: '支付通道管理',
    path: 'paychannel',
  }],
}*/];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
