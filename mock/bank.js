import { getUrlParams } from './utils'
import { getArea } from './citys';


const bankList = [{"id":null,
  "name":"上海浦东发展银行",
  "bankCode":null,
  "alliedBankCode":null,
  "province":null,
  "city":null,
  "localBankCode":null,
  "optimistic":null,
  "bankOrgCode":null,
  "type":"上海浦东发展银行"},
  {"id":null,
    "name":"中信银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中信银行"},
  {"id":null,
    "name":"中国光大银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国光大银行"},
  {"id":null,
    "name":"中国农业银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国农业银行"},
  {"id":null,
    "name":"中国工商银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国工商银行"},
  {"id":null,
    "name":"中国建设银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国建设银行"},
  {"id":null,
    "name":"中国民生银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国民生银行"},
  {"id":null,
    "name":"中国邮政储蓄银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国邮政储蓄银行"},
  {"id":null,
    "name":"中国银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"中国银行"},
  {"id":null,
    "name":"交通银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"交通银行"},
  {"id":null,
    "name":"兴业银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"兴业银行"},
  {"id":null,
    "name":"其他",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"其他"},
  {"id":null,
    "name":"北京银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"北京银行"},
  {"id":null,
    "name":"华夏银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"华夏银行"},
  {"id":null,
    "name":"平安银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"平安银行"},
  {"id":null,
    "name":"广发银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"广发银行"},
  {"id":null,
    "name":"招商银行",
    "bankCode":null,
    "alliedBankCode":null,
    "province":null,
    "city":null,
    "localBankCode":null,
    "optimistic":null,
    "bankOrgCode":null,
    "type":"招商银行"}];
let subBranch = [];
bankList.map(function (val,index) {
  let bank =  new Array(11).fill({});
  bank = bank.map( (v,i) => {
    return {
      "id":index+i,
      "name":`${val.name}支行${i}`,
      "bankCode":"302",
      "alliedBankCode":"302100011753",
      "province":"11",
      "city":"1101,1102",
      "localBankCode":val.name,
      "optimistic":0,
      "bankOrgCode":"1000",
      "type":null
    }
  });
  subBranch.push(...bank);


})
export  function querySubBranch(parent,city){
  if(!parent || !city){
    return [];
  }
  //const bankObj =  bankList.filter((data) => data.name === parent)[0];
  let bank =  new Array(5).fill({});
  let cityName = getArea(city[1]);
  cityName = cityName.substr(0,cityName.length - 1);
  bank = bank.map( (v,i) => {
    return {
      "id":i,
      "name":`${parent}${cityName}支行${i}`,
      "bankCode":i,
      "alliedBankCode":"302100011753",
      "province":city[0],
      "city":city[1],
      "localBankCode":parent,
      "optimistic":0,
      "bankOrgCode":"1000",
      "type":null
    }
  });
  return bank;

}
export  function queryBankList(){
  return bankList;

}
export function getBankList(req, res, u){

  const result = queryBankList();
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}
export function getSubBranch(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const result = querySubBranch(params.localBankCode,[params.province,params.city]);
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}
export default {
  getBankList,
  getSubBranch
};
