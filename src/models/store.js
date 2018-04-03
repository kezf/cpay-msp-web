import { queryStoreList,queryCashierList,addCashierList,editCashierList,deleteCashierList,changeCashierPwd,getCashier } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'store',

  state: {
    list: [],
    cashier:{
      list: [],
      pagination: {},
    },
    cashierObj:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStoreList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchCashier({ payload }, { call, put }) {
      const response = yield call(queryCashierList, payload);
      yield put({
        type: 'queryCashier',
        payload: response,
      });
    },
    *getCashier({ payload }, { call, put }) {
      const response = yield call(getCashier, payload);
      yield put({
        type: 'getCashierObj',
        payload: response,
      });
    },
    *addCashier({ payload,callback }, { call, put }) {

      const result= yield call(addCashierList, payload);
      if(result.status == 200){
        message.success('提交成功');
        if(callback) callback(result);
      }else{
        message.error(result.message);
      }
    },
    *editCashier({ payload,callback }, { call, put }) {

      const result= yield call(editCashierList, payload);
      if(result.status == 200){
        message.success('提交成功');
        if(callback) callback(result);
      }else{
        message.error(result.message);
      }
    },
    *deleteCashier({ payload,callback }, { call, put }) {

      const result= yield call(deleteCashierList, payload);
      if(result.status == 200){
        message.success('删除成功');
        if(callback) callback(result);
      }else{
        message.error(result.message);
      }
    },
    *changePwd({ payload,callback }, { call, put }) {
      payload.userid = JSON.parse(localStorage.getItem('user')).userid;
      const result= yield call(changeCashierPwd, payload);
      if(result.status == 200){
        message.success('修改成功');
      }else if(result.status !== 'error'){
        message.error(result.message);
      }
      if(callback) callback(result);
    },


  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryCashier(state, action) {
      return {
        ...state,
        cashier: action.payload,
      };
    },
    getCashierObj(state, action) {
      return {
        ...state,
        cashierObj: action.payload,
      };
    },

  },
};
