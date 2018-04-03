import { getUrlParams } from './utils'
import { getMerchantList } from './merchant';
import { getUser } from './user';
import { hex_md5 } from './md5'

let cashierList = [];


for(var i=0;i<20;i++){
  cashierList.push({
    code: '',
    createTime: new Date().getTime(),
    id: i,
    key:i,
    merchantId: 45,
    name: `测试${i}`,
    password: null,
    updateTime: new Date().getTime(),
    trcansationMoney: null,
    trcansationNum: 0
  });
}

export function queryStoreList(req, res, u){

  const result = getMerchantList(req, res, u, 'info').list;
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function queryCashierList(req, res, u){

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let data = cashierList.filter((val)=>Number(val.merchantId) === Number(params.merchantId));
  if (params.searchCode) {
    data = data.filter(val => val.code.indexOf(params.searchCode) > -1);
  }
  if (params.searchName) {
    data = data.filter(val => val.name.indexOf(params.searchName) > -1);
  }
  if (params.serachTimeStart && params.serachTimeEnd) {
    const start = params.serachTimeStart;
    const end = params.serachTimeEnd;
    data= data.filter(val => new Date(val.createTime).getTime()>=new Date(start + ' 00:00:00').getTime()
      && new Date(val.createTime).getTime()<=new Date(end + ' 23:59:59').getTime());
  }
  data = data.sort(function (a,b) {
    return b.createTime - a.createTime;
  })
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: data,
    pagination: {
      total: data.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function getCashier(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  const result = cashierList.filter((val)=>Number(val.id) === Number(params.id))[0];
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function addCashierList(req, res, u){


  const body = req.body;

  body.id = cashierList.length?Math.max(cashierList.map((val)=>val.id))+1:1;
  body.password = hex_md5(body.password);
  body.key = body.id;

  const data = Object.assign({
    code: '',
    createTime: new Date().getTime(),
    id: 0,
    merchantId: 0,
    name: '',
    password: null,
    updateTime: new Date().getTime(),
    trcansationMoney: null,
    trcansationNum: 0
  },body);

  cashierList.push(data);

  const result = {
    status:200,
    message:'保存成功'
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function editCashierList(req, res){


  const body = req.body;

  let cashier = cashierList.filter((val) => parseInt(val.id,10) === parseInt(body.id,10))[0];

  Object.assign(cashier,{
    name:body.name,
    code:body.code
  });

  const result = {
    status:200,
    message:'保存成功'
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function deleteCashierList(req, res,u){


  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  cashierList = cashierList.filter((val) => parseInt(val.id,10) !== parseInt(params.id,10));

  const result = {
    status:200,
    message:'保存成功'
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function changeCashierPwd(req, res, u){


  const body = req.body;
  const user = getUser(body.userid);
  let result = {};


  if(hex_md5(body.adminPwd) !== user.password){
    result = {
      status:'error',
      message:'管理员密码错误'
    }
  }else{
    const pwd = hex_md5(body.newPassword);

    const obj = cashierList.filter((val) => parseInt(val.id,10) === parseInt(body.id,10))[0];
    obj.password = pwd;

    result = {
      status:200,
      message:'修改成功'
    }
  }


  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export default {
  queryStoreList,
  queryCashierList,
  addCashierList,
  editCashierList,
  deleteCashierList,
  changeCashierPwd
};
