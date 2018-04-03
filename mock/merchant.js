import { getUrlParams } from './utils';
import { getDetailFn,getNameListFn, getDetailNameListFn } from './industry';
import { getAddress } from './citys';
import { queryBankList,querySubBranch } from './bank'

// mock tableListDataSource
let tableListDataSource = [];
let reviewListDataSource = [];

let statusList = [{type: null, name: null, key: "1", value: "保存未提交"},
  {type: null, name: null, key: "2", value: "开户申请审核中"},
  {type: null, name: null, key: "3", value: "开户审核不通过"},
  {type: null, name: null, key: "4", value: "信息变更审核中"},
  {type: null, name: null, key: "5", value: "信息变更审核不通过"},
  {type: null, name: null, key: "6", value: "正常"}];

let typeList = [{"type":null,"name":null,"key":"1","value":"普通店"},
  {"type":null,"name":null,"key":"2","value":"总店"},
  {"type":null,"name":null,"key":"3","value":"分店"}];


let operatorList = [{type: null, name: null, key: "-1", value: "升腾资讯"}];

for (let i = 0; i < 6; i += 1) {
  operatorList.push({type: null, name: null, key: i, value: `运营商${i}`});
}
let instList = [{type: null, name: null, key: "-1", value: "浙江农信",parent:'-1',parentName:'升腾资讯'}];
for (let i = 0; i < 10; i += 1) {
  const pid = Math.floor(Math.random() * 10) % 6;
  instList.push({type: null, name: null, key: i, value: `服务商${i}`,parent:pid,parentName: `运营商${pid}`});
}

const reviewResultType = {
  1:'未审核',
  2:'通过',
  3:'不通过'
};

let getReviewList = function (obj,i,le) {

  let reviewResult = Math.floor(Math.random() * 10) % 3 + 1;
  const reviewUserId = Math.floor(Math.random() * 10) % 3 + 1;
  if(i === 0){
    if(obj.merchantStatus == 3 || obj.merchantStatus == 5){
      reviewResult = 3;
    }
    if(obj.merchantStatus == 6){
      reviewResult = 2;
    }
  }
  const reviewObj = {
    "reviewId":`${obj.merchantId}${i}`,
    "reviewType":i >= le-1?1:2,
    "reviewTypeName":i >= le-1?'开户申请审核':'信息变更审核',
    "reviewFormId":57,
    "reviewUserId":reviewResult===1?null:reviewUserId,
    "reviewUserName":reviewResult===1?null:`系统管理员${reviewUserId}`,
    "reviewTime":reviewResult===1?null:obj.applyTime - 24 * 3600 *5000 * (i+1) + Math.floor(Math.random() * 24 * 3600 *1000) + 24 * 3600 *1000,
    "applyDate":null,
    "reviewResult":reviewResult,
    "reviewOpinion":null,
    "merchantId":obj.merchantId,
    "applyId":null,
    "merchantName":null,
    "operatorId":null,
    "instId":null,
    "reviewTimeSt":null,
    "reviewTypeMer":1,
    "reviewTypeTer":2,
    "reviewTypeBase":3,
    "reviewTypeBalan":4,
    "reviewTypeCont":5,
    "reviewResultName":reviewResultType[reviewResult],
    "applyTimeSt":null,
    "merchantNo":null,
    "instName":null,
    "applyUserName":null,
    "legalPersonName":null,
    "serachTimeStart":null,
    "serachTimeEnd":null,
    "reviewTimes":0,
    "merchantApplyStatus":null,
    "terApplyStatus":null,
    "baseApplyStatus":null,
    "balanceApplyStatus":null,
    "contactApplyStatus":null,
    "applyTime":obj.applyTime - 24 * 3600 *5000 * (i+1) + Math.floor(Math.random() * 24 * 3600 *1000)
  };


    return reviewObj;
}

const merchantItem = {
  key: 0,
  accountType:1,
  applyTime:new Date().getTime(),
  applyUserId:0,
  applyUserName:null,
  businessPersonName:null,
  contactMobilePhone:null,
  contactPhone:null,
  industryTypeName:null,
  instName: null,
  isRegister:0,
  isRegisterName:"否",
  legalPersonName:null,
  merchantCode:null,
  merchantId:0,
  merchantType:1,
  merchantTypeName:'普通店',
  merchantName:null,
  merchantShortName:null,
  merchantNo:null,
  merchantStatus:1,
  merchantStatusName:statusList.filter(v => Number(v.key) === 1)[0].value,
  operatorName:null,
  rates:null,
  reviewTime:null,
  serachTimeEnd:null,
  serachTimeStart:null,
  terminalModelNames:null,
  terminalNumbers:null,
  terminalTypeNames:null,
  terminalVersionNames:null,
  account:null,
  accountBankBranchName:null,
  accountBankNameId:null,
  accountCityCode:null,
  accountCityName:null,
  accountIdcard:null,
  accountName:null,
  accountProvinceCode:null,
  accountProvinceName:null,
  accountTypeName:null,
  agreementUrlId:null,
  alliedBankCode:null,
  applyPosType:null,
  bankCardBackId:null,
  bankCardBackUrl:null,
  bankCardId:null,
  bankCardUrl:null,
  businessAddress:null,
  businessCityCode:null,
  businessCityName:null,
  businessDistrictCode:null,
  businessDistrictName:null,
  businessLicense:null,
  businessLicenseEndtime:null,
  businessLicenseStarttime:null,
  businessLicenseUrl:null,
  businessLicenseUrlId:null,
  businessPersonId:null,
  businessProvinceCode:null,
  businessProvinceName:null,
  businessZipCode:null,
  certCode:null,
  certName:null,
  contact:null,
  contractEndtime: null,
  contractNumber:null,
  contractStarttime:null,
  couponMode:"1",
  createTime:new Date().getTime(),
  dayMaxnum:null,
  fax:null,
  "feeType":null,
  "settlementPeriod":null,
  "rate":null,
  "username":"18765412300",
  "merchantCategory":null,
  "mcc":null,
  "openPermitsUrlId":null,
  "storePicUrlId":null,
  "otherPicUrlId":null,
  "storeLogoUrlId":null,
  "legalPersonCertificateBackId":null,
  "legalPersonCertificateBackUrl":null,
  "storePhone":null,
  "updateTime":null,
  "storeLogoUrl":null,
  "storePicUrl":null,
  "newStoreLogoUrl":null,
  "newStorePicUrl":null,
  "organizationCodeUrl":null,
  "legalPersonCertificateUrl":null,
  "newOrganizationCodeUrl":null,
  "newLegalPersonCertificateUrl":null,
  "newBusinessLicenseUrl":null,
  "reviewList":null,
  "terminalList":[],
  "settlementPeriodName":null,
  "parentMerchantName":null,
  "payChannelList":[],
  "mpId":null,
  "mpName":null,
  "headUrl":null,
  "password":null,
  "operatorId":0,
  "instId":-1,
  "parentMerchantId":0,
  "registerProvinceCode":null,
  "registerCityCode":null,
  "registerDistrictCode":null,
  "registerAddress":null,
  "registerZipCode":null,
  "landlinePhone":null,
  "registeredCapital":null,
  "organizationCode":"",
  "organizationCodeUrlId":null,
  "taxRegistration":null,
  "taxRegistrationUrlId":null,
  "legalPersonCertificateTypeId":null,
  "legalPersonCertificate":null,
  "legalPersonCertificateUrlId":null,
  "industryType":null,
  "industryNo":null,
  "managementContent":null,
  "functions":null,
  "singleMinimum":null,
  "singleMaxnum":null,
  "monthMaxnum":null,
};

for (let i = 0; i < 46; i += 1) {
  const merchantStatus = Math.floor(Math.random() * 10) % 6 + 1;
  const merchantType = Math.floor(Math.random() * 10) % 3 + 1;
  const isRegister = Math.floor(Math.random() * 10) % 2;
  const merchant = Object.assign({},merchantItem,{
    key: i,
    accountType:1,
    applyTime:new Date(`2017-07-${(Math.floor(i / 2) + 1)<10?'0'+(Math.floor(i / 2) + 1):(Math.floor(i / 2) + 1)} 15:19:${i<10?'0'+i:i}`).getTime(),
    applyUserId:115,
    applyUserName:"xtgl",
    businessPersonName:null,
    contactMobilePhone:`18${Math.floor(Math.random() * 10) % 6}${Math.floor(Math.random() * 100000000)}`,
    contactPhone:null,
    industryTypeName:null,
    instName: instList[Math.floor(Math.random() * 10) % 7].value,
    isRegister:isRegister,
    isRegisterName:isRegister?"是":"否",
    legalPersonName:null,
    merchantCode:null,
    merchantId:i,
    merchantType:merchantType,
    merchantTypeName:typeList.filter(v => Number(v.key) === Number(merchantType))[0].value,
    merchantName:`测试${i}`,
    merchantShortName:"测试",
    merchantNo:(Math.floor(Math.random() * 999999999999999)+1)+'',
    merchantStatus:merchantStatus,
    merchantStatusName:statusList.filter(v => Number(v.key) === Number(merchantStatus))[0].value,
    operatorName:operatorList[Math.floor(Math.random() * 10) % 7].value,
    accountBankNameId:"中信银行",
    accountCityCode:"1101",
    accountCityName:"北京市",
    accountProvinceCode:"11",
    accountProvinceName:"北京市",
    accountTypeName:"对公账号",
    businessAddress:"发发发",
    businessCityCode:"1101",
    businessCityName:"北京市",
    businessDistrictCode:"110101",
    businessDistrictName:"东城区",
    businessLicense:"yingyezhizhao",
    businessProvinceCode:"11",
    businessProvinceName:"北京市",
    contact:"测试",
    contractNumber:"GP2018011915192706722",
    couponMode:"1",
    createTime:1516346367000,
    dayMaxnum:100000,
    "updateTime":1516081522000,
    "storeLogoUrl":"/cerfile/201801/image-2da80a36-4254-4047-be07-bd2b4bf87b55.jpg",
    "parentMerchantName":"德克士",
    "operatorId":1,
    "instId":-1,
    "parentMerchantId":5,
    "legalPersonCertificate":"350101111111111111",
    "managementContent":"挂号平台",
    "singleMinimum":1.00,
    "singleMaxnum":50000.00,
    "monthMaxnum":1000000.00,
  });
  tableListDataSource.push(merchant);
  if(merchantStatus !== 1 && merchantStatus !== 2){
    const reviewLength = (merchantStatus === 3)?1:Math.floor(Math.random() * 10) % 5 + 1;
    for(let j = 0; j < reviewLength; j += 1){
      const review = getReviewList(merchant,j,reviewLength);
      reviewListDataSource.push(review);
    }


  }

}

export function getMerchantList(req, res, u, type) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.merchantStatus) {
    const status = params.merchantStatus.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.merchantStatus, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }


  let merchantStatus = params.merchantStatus;

  if (!params.merchantStatus){
    switch(type){
      case 'open':
        merchantStatus = '1,2,3';
        break;
      case 'info':
        merchantStatus = '6';
        break;
      case 'review':
        merchantStatus = '2,4';
        break;

    }
  }

  if (merchantStatus) {
    const status = merchantStatus.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.merchantStatus, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.instName) {
    const instName = params.instName.split(',');
    let filterDataSource = [];
    instName.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => data.instName === s)
      );
    });
    dataSource = filterDataSource;
  }

  if (params.operatorName) {
    const operatorName = params.operatorName.split(',');
    let filterDataSource = [];
    operatorName.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => data.operatorName === s)
      );
    });
    dataSource = filterDataSource;
  }

  if (params.merchantName) {
    dataSource = dataSource.filter(data => data.merchantName.indexOf(params.merchantName) > -1);
  }
  if (params.merchantNo) {
    dataSource = dataSource.filter(data => data.merchantNo.indexOf(params.merchantNo) > -1);
  }
  if (params.serachTimeStart && params.serachTimeEnd) {
    const start = params.serachTimeStart;
    const end = params.serachTimeEnd;
    dataSource = dataSource.filter(data => new Date(data.applyTime).getTime()>=new Date(start + ' 00:00:00').getTime()
    && new Date(data.applyTime).getTime()<=new Date(end + ' 23:59:59').getTime());
  }

  const sorterParam = params.sorter?params.sorter:'applyTime_descend';

  if (sorterParam) {
    const s = sorterParam.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        if(s[0] === 'applyTime'){
          return new Date(next[s[0]]) - new Date(prev[s[0]]);
        }
        return next[s[0]] - prev[s[0]];
      }
      if(s[0] === 'applyTime'){
        return new Date(prev[s[0]]) - new Date(next[s[0]]);
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return result;


}


function getId(list,name) {
  list = list.sort((prev, next) => {
    return new Date(next[name]) - new Date(prev[name]);
  });
  return Number(list[0][name])+1;
}

function setMerchant(merchantId,obj) {
  const merchant = getMerchantObj(merchantId);
  const index = tableListDataSource.indexOf(merchant);
  Object.assign(tableListDataSource[index],obj);

}


export function getOperatorList(req, res, u){
  const result = operatorList.map((o) => {return {text:o.value,value:o.value}});
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function getInstList(req, res, u){
  const result = instList.map((o) => {return {text:o.value,value:o.value}});
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getMerchantOpenList(req, res, u){
  const list = getMerchantList(req, res, u, 'open');
  const operator = getOperatorList();
  const inst = getInstList();
  const result = {
    list:list,
    operator:operator,
    inst:inst
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getMerchantInfoList(req, res, u){
  const list = getMerchantList(req, res, u, 'info');
  const operator = getOperatorList();
  const inst = getInstList();
  const result = {
    list:list,
    operator:operator,
    inst:inst
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getMerchantReviewList(req, res, u){
  const list = getMerchantList(req, res, u, 'review');
  const operator = getOperatorList();
  const inst = getInstList();
  const result = {
    list:list,
    operator:operator,
    inst:inst
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function getMerchant(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  const view = tableListDataSource.filter(data => Number(data.merchantId) === Number(params.merchantId))[0];
  let result = {
    view:view,
    name:[],
    citysList:[],
    detail:{},
    parent:[],
    accountCitysList:[],
    bankList:[],
    subBranch:[]
  };
  if(params.type === 'edit'){
    let citysList2 = [];
    const detail = getDetailFn({detailName:view.managementContent,nameType:view.merchantType});
    const name = getNameListFn({nameType:view.merchantType});
    const detailList = getDetailNameListFn({name:detail.name,nameType:view.merchantType});

    const nameList = name.map((val) => {if(val.value === detail.name){
      return {
        children:detailList,
        ...val
      }
    }else{
      return val;
    }});

    /*获取初始化地点列表*/
    const areaList = getAddress(view.businessCityCode);
    const provinceList = getAddress(1);
    const cityList = getAddress(view.businessProvinceCode);
    const citysList0 = areaList.map((val)=>{
      return {
        value:val.code,
        label:val.name,
      };
    });
    const citysList1 = cityList.map((val) => {if(val.code === view.businessCityCode){
      return {
        children:citysList0,
        value:val.code,
        label:val.name,
        isLeaf: false
      }
    }else{
      return {
        value:val.code,
        label:val.name,
        isLeaf: false
      };
    }});
    citysList2 = provinceList.map((val) => {if(val.code === view.businessProvinceCode){
      return {
        children:citysList1,
        value:val.code,
        label:val.name,
        isLeaf: false
      }
    }else{
      return {
        value:val.code,
        label:val.name,
        isLeaf: false
      };
    }});

    const accountCityList = view.accountProvinceCode?
      getAddress(view.accountProvinceCode).map((val) => {
        return {
          value:val.code,
          label:val.name,
        };
      }):[];
    const accountCitysList = view.accountProvinceCode?provinceList.map((val) => {if(val.code === view.accountProvinceCode){
      return {
        children:accountCityList,
        value:val.code,
        label:val.name,
        isLeaf: false
      }
    }else{
      return {
        value:val.code,
        label:val.name,
        isLeaf: false
      };
    }}):provinceList.map((val) => {
      return {
        value:val.code,
        label:val.name,
        isLeaf: false
      }
    });

    let parent = tableListDataSource.filter(data => Number(data.merchantType) === 2);

    parent = parent.sort((prev, next) => {
      return new Date(next['applyTime']) - new Date(prev['applyTime']);
    });
    result = {
      view:view,
      name:nameList,
      citysList:citysList2,
      detail:detail,
      parent:parent,
      accountCitysList:accountCitysList,
      bankList:queryBankList(),
      subBranch:querySubBranch(view.accountBankNameId,[view.accountProvinceCode,view.accountCityCode])
    }


  }else{
    let review = reviewListDataSource.filter(data => Number(data.merchantId) === Number(params.merchantId));

    review = review.sort((prev, next) => {
      return new Date(next['applyTime']) - new Date(prev['applyTime']);
    });
    result.view.review = review.length?review[0]:null;
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function getMerchantObj(merchantId){

  const result = tableListDataSource.filter(data => Number(data.merchantId) === Number(merchantId))[0];
  return result;


}

export function getMerchantReview(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  let result = reviewListDataSource.filter(data => Number(data.merchantId) === Number(params.merchantId));

  result = result.sort((prev, next) => {
    return new Date(next['applyTime']) - new Date(prev['applyTime']);
  });

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getParentMerchant(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }


  let result = tableListDataSource.filter(data => Number(data.merchantType) === 2);

  result = result.sort((prev, next) => {
    return new Date(next['applyTime']) - new Date(prev['applyTime']);
  });

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function addReview(req, res, u, b){
  const body = (b && b.body) || req.body;
  const { merchantId, reviewUserId, reviewUserName, reviewResult, reviewOpinion } = body;
  const merchant = getMerchantObj(merchantId);
  const {applyTime, merchantStatus} = merchant;
  const reviewType = merchantStatus == 2?1:2;

  let newStatus;
  if(reviewResult == 2){
    newStatus = 6;
  }else{
    switch (merchantStatus){
      case 2:
        newStatus = 3;
        break;
      case 4:
        newStatus = 5
        break;
    }
  }

  setMerchant(merchantId,{
    merchantStatus:newStatus,
    merchantShortName:statusList.filter(v => Number(v.key) === Number(newStatus))[0].value
  });

  const reviewObj = {
    "reviewId":getId(reviewListDataSource,'reviewId'),
    "reviewType":reviewType,
    "reviewTypeName":reviewType == 1?'开户申请审核':'信息变更审核',
    "reviewFormId":57,
    "reviewUserId":reviewUserId,
    "reviewUserName":reviewUserName,
    "reviewTime":new Date().getTime(),
    "applyDate":null,
    "reviewResult":reviewResult,
    "reviewOpinion":reviewOpinion,
    "merchantId":merchantId,
    "applyId":null,
    "merchantName":null,
    "operatorId":null,
    "instId":null,
    "reviewTimeSt":null,
    "reviewTypeMer":1,
    "reviewTypeTer":2,
    "reviewTypeBase":3,
    "reviewTypeBalan":4,
    "reviewTypeCont":5,
    "reviewResultName":reviewResultType[reviewResult],
    "applyTimeSt":null,
    "merchantNo":null,
    "instName":null,
    "applyUserName":null,
    "legalPersonName":null,
    "serachTimeStart":null,
    "serachTimeEnd":null,
    "reviewTimes":0,
    "merchantApplyStatus":null,
    "terApplyStatus":null,
    "baseApplyStatus":null,
    "balanceApplyStatus":null,
    "contactApplyStatus":null,
    "applyTime":applyTime
  };
  reviewListDataSource.push(reviewObj);

  const result = {
    status:200,
    message:'审核成功'
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function addMerchant(req, res, u, b){
  const body = (b && b.body) || req.body;

  if(!body.merchantId){
    body.merchantId = getId(tableListDataSource,'merchantId');
    body.merchantStatus = 2;
    body.merchantNo = new Date().getTime()*100 + Math.floor(Math.random() * 100) % 11 ;
    const instObj = instList.filter(data => Number(data.value) === body.instName);
    body.operatorName = instObj.length?instObj[0].parentName:'升腾资讯';

    const merchantObj = Object.assign({},merchantItem,body);


    tableListDataSource.push(merchantObj);
  }else{

    tableListDataSource = tableListDataSource.map((data)=>{
      if(Number(data.merchantId) === Number(body.merchantId)){
        if(Number(data.merchantStatus) === 6){
          body.merchantStatus = 4;
          body.merchantStatusName = '信息变更审核中';
        }
        return Object.assign({},data,body);
      }
      return data;
    });
  }


  const result = {
    status:200,
    message:'提交成功',
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function removeMerchant(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);

  tableListDataSource = tableListDataSource.filter(data => Number(data.merchantId) !== Number(params.merchantId));

  const result = {
    status:200,
    message:'删除成功'
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}




export default {
  getMerchantOpenList,
  getOperatorList,
  getInstList,
  getMerchantReviewList,
  getMerchant,
  getMerchantReview,
  addReview,
  addMerchant,
  removeMerchant,
  getParentMerchant
};
