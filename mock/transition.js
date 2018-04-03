import { getUrlParams, formatDate } from './utils';
import { terminalList } from './terminal';

let transactionList = [];
for(let i=0;i<terminalList.length;i++){
  const arr = new Array(5).fill({}).map((val,index) => {
    const time = new Date().getTime() - Math.floor(Math.random()*30)*3600*24*1000;
    const trcansationMoney = 5 + Math.ceil(Math.random()*1000);
    const merFee = Math.ceil(Math.random()*5);
    const discountFee = Math.ceil(Math.random()*5);
    return {
      "id":`${i}${index}`,
      "trcansationType":Math.ceil(Math.random()*3),
      "trcansationTypeSt":"微信支付-H5支付",
      "terminalSerial":terminalList[i].terminalSerial,
      "orderNo":new Date().getTime(),
      "terminalNo":terminalList[i].terminalNo,
      "merchantNo":terminalList[i].merchantNo,
      "trcansationTime":time,
      "trcansationSource":null,
      "platformSerial":"067011",
      "outBankAccount":"622714******1224",
      "inBankAccount":null,
      "trcansationMoney":trcansationMoney,
      "trcansationFlag":['oo','01','-1','04'][Math.floor(Math.random()*4)],
      "payChannel":['hebao','weixin','alipay','jieji','bank'][Math.floor(Math.random()*5)],
      "merFee":merFee,
      "discountFee":discountFee,
      "termSeq":"D1V0110002666",
      "businessType":Math.ceil(Math.random()*2),
      "cardType":0,
      "cardNo":"6227142465741224",
      "arriveTime":time,
      "setDate":"20180121",
      "cardIssuers":"交通银行",
      "realmoney":trcansationMoney + merFee - discountFee,
      "refund_total":null,
      "refund_money":null,
      "instName":terminalList[i].instName,
      "merchantName":terminalList[i].merchantName,
      "refundSuccess":1,
      "refundFail":0,
      "feeIn":1,
      "feeOut":-1
    }
  });
  transactionList = [
    ...transactionList,
    ...arr
  ]
}

function querySummaryList(list) {
  let summaryList = [];
  let summaryMap = {};

  list.forEach(function (item,index) {
    const date = formatDate(new Date(item.trcansationTime),'yyyy-MM-dd');
    if(!summaryMap[date]) summaryMap[date] = {};
    summaryMap[date][`${item.merchantNo}`] = summaryMap[date][`${item.merchantNo}`]?summaryMap[date][`${item.merchantNo}`]:{
      totalTrcansNum:0,
      totalTrcansationMoney:0,
      totalMerFee:0,
      totalDiscount:0,
      totalMoney:0,
      merchantName:item.merchantName,
      merchantNo:item.merchantNo,
      trcansationTime:date
    }
    summaryMap[date][`${item.merchantNo}`].totalTrcansNum += 1;
    summaryMap[date][`${item.merchantNo}`].totalTrcansationMoney += item.trcansationMoney;
    summaryMap[date][`${item.merchantNo}`].totalMerFee += item.merFee;
    summaryMap[date][`${item.merchantNo}`].totalDiscount += item.discountFee;
    summaryMap[date][`${item.merchantNo}`].totalMoney += item.realmoney;

  })


  for( const dateStr in summaryMap){
    const dateObj = summaryMap[dateStr];
    for( const merchantNo in dateObj){
      summaryList = [{
        id:summaryList.length + 1,
        ...dateObj[merchantNo]
      },...summaryList]
    }
  }

  return summaryList;
}

export function queryTransactionList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  if(params.trcansationTimeStart && params.trcansationTimeEnd){
    dataSource = transactionList.filter(val =>
      val.trcansationTime >= new Date(params.trcansationTimeStart + ' 00:00:00').getTime() &&
      val.trcansationTime <= new Date(params.trcansationTimeEnd + ' 23:59:59').getTime())
  }

  if(dataSource.length && params.platformSerial){
    dataSource = dataSource.filter(val => val.platformSerial.indexOf(params.platformSerial) > -1);
  }

  if(dataSource.length && params.merchantNo){
    dataSource = dataSource.filter(val => val.merchantNo.indexOf(params.merchantNo) > -1);
  }

  if(dataSource.length && params.merchantName){
    dataSource = dataSource.filter(val => val.merchantName.indexOf(params.merchantName) > -1);
  }

  const countList = [...dataSource];

  if(dataSource.length && params.businessType){
    const businessType = params.businessType.split(',');
    let filterDataSource = [];
    businessType.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(val => parseInt(val.businessType,10) === parseInt(s,10))
      );
    });
    dataSource = filterDataSource;
  }

  if(dataSource.length && params.payChannel){
    const payChannel = params.payChannel.split(',');
    let filterDataSource = [];
    payChannel.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(val => val.payChannel === s)
      );
    });
    dataSource = filterDataSource;
  }

  if(dataSource.length && params.trcansationType){
    const trcansationType = params.trcansationType.split(',');
    let filterDataSource = [];
    trcansationType.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(val => parseInt(val.trcansationType,10) === parseInt(s,10))
      );
    });
    dataSource = filterDataSource;
  }
  if(dataSource.length && params.trcansationFlag){
    const trcansationFlag = params.trcansationFlag.split(',');
    let filterDataSource = [];
    trcansationFlag.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(val => val.trcansationFlag === s)
      );
    });
    dataSource = filterDataSource;
  }

  dataSource = dataSource.sort((prev, next) => {
    return new Date(next['trcansationTime']) - new Date(prev['trcansationTime']);
  });

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
    countList:countList
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }


}

export function getFlow(req, res, u) {
  const data = queryTransactionList(req,null,u);
  let trcansationMoney = 0;
  let merFee = 0;
  let discountFee = 0;
  let realmoney = 0;
  data.countList.forEach((item) => {
    trcansationMoney += item.trcansationMoney;
    merFee += item.merFee;
    discountFee += item.discountFee;
    realmoney += item.realmoney;
  })
  const result = {
    data:{
      list:data.list,
      pagination:data.pagination
    },
    count:{
      tradeNumber:data.countList.length,
      trcansationMoney:trcansationMoney,
      merFee:merFee,
      discountFee:discountFee,
      realmoney:realmoney
    }
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getSummary(req, res, u) {
  const data = queryTransactionList(req,null,u);

  let list = querySummaryList(data.list);

  let trcansationMoney = 0;
  let merFee = 0;
  let discountFee = 0;
  let realmoney = 0;
  list.forEach((item) => {
    trcansationMoney += item.totalTrcansationMoney;
    merFee += item.totalMerFee;
    discountFee += item.totalDiscount;
    realmoney += item.totalMoney;
  })

  list = list.sort((prev, next) => {
    return new Date(next['trcansationTime']) - new Date(prev['trcansationTime']);
  })

  const result = {
    data:{
      list:list,
      pagination:{
        total:list.length,
        pageSize:data.pagination.pageSize,
        current: data.pagination.current,
      }
    },
    count:{
      trcansationMoney:trcansationMoney,
      merFee:merFee,
      discountFee:discountFee,
      realmoney:realmoney
    }
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getPoundage(req, res, u) {
  const data = queryTransactionList(req,null,u);

  let list = querySummaryList(data.list);

  let yyTrcansationMoney = 0;
  let ysTrcansationMoney = 0;
  let yyMerFee = 0;
  let ysMerFee = 0;
  data.list.forEach((item) => {
    if(parseInt(item.businessType,10) === 1){
      yyTrcansationMoney += item.trcansationMoney;
      yyMerFee += item.merFee;
    }else{
      ysTrcansationMoney += item.trcansationMoney;
      ysMerFee += item.merFee;
    }

  })

  list = list.sort((prev, next) => {
    return new Date(next['trcansationTime']) - new Date(prev['trcansationTime']);
  })

  const result = {
    data:{
      list:list,
      pagination:{
        total:list.length,
        pageSize:data.pagination.pageSize,
        current: data.pagination.current,
      }
    },
    count:{
      yyTrcansationMoney,
      yyMerFee,
      ysTrcansationMoney,
      ysMerFee
    }
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  queryTransactionList,
  getFlow,
  getSummary,
  getPoundage
}
