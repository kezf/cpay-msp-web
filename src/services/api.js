import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function getTradTrend(params) {
  return request('/api/fake_chart_data', {
    method: 'GET',
    body: params,
  });
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

/*home*/

export async function getInfoList() {
  return request('/information_a/getInfoList');
}
/*merchant*/
export async function getMerchantOpenList(params) {
  return request(`/merchant/list?${stringify(params)}`);
}
export async function getMerchantInfoList(params) {
  return request(`/merchant/flist?${stringify(params)}`);
}
export async function getOperatorList() {
  return request('/carrier/list');
}
export async function getInstList() {
  return request('/cardBinActivity/instList');
}
export async function getMerchantReviewList(params) {
  return request(`/merchantReview/list?${stringify(params)}`);
}
export async function getMerchant(params,success) {
  return request(`/store/merchantDetail?${stringify(params)}`,{},success);
}
export async function getMerchantReview(params) {
  return request(`/merchantReview/listByMerchant?${stringify(params)}`);
}
export async function getTerminalList(params) {
  return request(`/terminalInfo/list?${stringify(params)}`);
}
export async function addMerchant(params) {
  return request('/merchant/add', {
    method: 'POST',
    body: params,
  });
}
export async function removeMerchant(params) {
  return request(`/merchant/remove?${stringify(params)}`);
}
export async function addReview(params) {
  return request('/merchantReview/add', {
    method: 'POST',
    body: params,
  });
}
export async function getParentMerchant() {
  return request('/merchant/getParentMerchantList');
}
export async function getNameList(params) {
  return request(`/industry/nameList?${stringify(params)}`);
}
export async function getDetailNameList(params) {
  return request(`/industry/detailNameList?${stringify(params)}`);
}
export async function getDetail(params) {
  return request(`/industry/detail?${stringify(params)}`);
}
export async function getCitys(params) {
  return request(`/industry/arealist?${stringify(params)}`);
}

export async function getSubBranch(params) {
  return request(`/industry/chooseBankBanchList?${stringify(params)}`);
}
export async function getBankList(params) {
  return request(`/industry/banks?${stringify(params)}`);
}

/*store*/

export async function queryStoreList(params) {
  return request(`/store/page?${stringify(params)}`);
}
export async function queryCashierList(params) {
  return request(`/cashier/page?${stringify(params)}`);
}
export async function addCashierList(params) {
  return request('/cashier/add', {
    method: 'POST',
    body: params,
  });
}
export async function editCashierList(params) {
  return request('/cashier/edit', {
    method: 'POST',
    body: params,
  });
}
export async function deleteCashierList(params) {
  return request(`/cashier/delete?${stringify(params)}`);
}
export async function getCashier(params) {
  return request(`/cashier/get?${stringify(params)}`);
}
export async function changeCashierPwd(params) {
  return request('/cashier/modPwd', {
    method: 'POST',
    body: params,
  });
}

/*transition*/

export async function getFlow(params) {
  return request(`/flow/list?${stringify(params)}`);
}
export async function getSummary(params) {
  return request(`/summary/list?${stringify(params)}`);
}
export async function getPoundage(params) {
  return request(`/poundage/list?${stringify(params)}`);
}

