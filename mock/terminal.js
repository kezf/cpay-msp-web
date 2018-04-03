import { getUrlParams } from './utils';
import { getMerchantObj } from './merchant';

let tableListDataSource = [];


for (let i = 0; i < 6; i += 1) {
  const businessType = Math.floor(Math.random() * 10)%2 + 1;
  const terminalModelId = Math.floor(Math.random() * 10)%2 + 1;
  const merchantId = Math.floor(Math.random() * 46) + 1;
  const merchant = getMerchantObj(merchantId);
  const terminal = {
    "terminalId":i + 1,
    "manufId":null,
    "instId":merchant.instId,
    "terminalName":null,
    "deviceSerial":`D1V0160000${Math.floor(Math.random() * 1000)}`,
    "terminalStatusId":null,
    "terminalTypeId":null,
    "terminalVersionId":null,
    "terminalModelId":terminalModelId,
    "terminalModel":terminalModelId === 2?'K9':'V8',
    "terminalBrand":null,
    "productionDate":null,
    "productionDateSt":null,
    "inDate":null,
    "stopDate":null,
    "returnDate":null,
    "remarks":null,
    "terminalStatusList":null,
    "merchantId":merchantId,
    "businessType":businessType,
    "businessTypeName":businessType===1?'营业款':'预收款',
    "area":null,
    "oilstationNo":null,
    "oilstationName":null,
    "merchantNo":merchant.merchantNo,
    "bindId":null,
    "merchantCode":null,
    "merchantName":merchant.merchantName,
    "instName":merchant.instName,
    "manufName":"升腾",
    "updateTime":null,
    "insertTime":null,
    "terminalBelongId":null,
    "carrierId":null,
    "terminalNo":Math.floor(Math.random() * 99999999) + 1};
  tableListDataSource.push(terminal);

}

export const terminalList = tableListDataSource;


export function getTerminalList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.businessType) {
    const status = params.merchantStatus.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.businessType, 10) === parseInt(s[0], 10))
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


  if (params.merchantName) {
    dataSource = dataSource.filter(data => data.merchantName.indexOf(params.merchantName) > -1);
  }
  if (params.merchantNo) {
    dataSource = dataSource.filter(data => data.merchantNo.indexOf(params.merchantNo) > -1);
  }
  if (params.terminalNo) {
    dataSource = dataSource.filter(data => data.terminalNo.indexOf(params.terminalNo) > -1);
  }
  if (params.merchantId) {
    dataSource = dataSource.filter(data => data.merchantId == params.merchantId);
  }



  let pageSize = 10;
  if (params.pageSize) {
    if(params.pageSize === 'all'){
      pageSize = dataSource.length;
    }else{
      pageSize = params.pageSize * 1;
    }

  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
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


export default {
  getTerminalList
};
