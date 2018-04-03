import { getMerchantOpenList, getMerchantInfoList, getMerchantReviewList,
  getOperatorList, getInstList, getMerchant, getMerchantReview, addReview,
  getParentMerchant,getNameList,getDetail,getDetailNameList, getSubBranch,
  removeMerchant, addMerchant, getBankList } from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'merchant',

  state: {
    data: {
      list: [],
      pagination: {},
    },//列表
    view:{},//详情
    operator:[],
    inst:[],
    review:[],
    parent:[],
    name:[],
    detail:{},
    detailList:[],
    citysList:[],
    accountCitysList:[],
    bankList:[],
    subBranch:[]

  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMerchantOpenList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchInfoList({ payload }, { call, put }) {
      const response = yield call(getMerchantInfoList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchReviewList({ payload }, { call, put }) {
      const response = yield call(getMerchantReviewList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchOperator({ payload }, { call, put }) {
      const response = yield call(getOperatorList, payload);
      yield put({
        type: 'operator',
        payload: response.map((o) => {return {text:o.value,value:o.value}}),
      });
    },
    *fetchInst({ payload }, { call, put }) {
      const response = yield call(getInstList, payload);
      yield put({
        type: 'inst',
        payload: response.map((o) => {return {text:o.value,value:o.value}}),
      });
    },

    *fetchView({ payload }, { call, put }) {
      const response = yield call(getMerchant, payload);

      yield put({
        type: 'view',
        payload: response,
      });
    },
    *fetchBank({ payload }, { call, put }) {
      const response = yield call(getBankList, payload);

      yield put({
        type: 'bank',
        payload: response,
      });
    },


    *setCitysList({ payload }, { call, put }){
      yield put({
        type: 'citysList',
        payload: payload.citysList,
      });
    },
    *setAccountCitysList({ payload }, { call, put }){
      yield put({
        type: 'accountCitysList',
        payload: payload.accountCitysList,
      });
    },
    *setName({ payload }, { call, put }){
      yield put({
        type: 'name',
        payload: payload.name,
      });
    },
    *fetchName({ payload }, { call, put }) {
      const name = yield call(getNameList, {nameType:payload.merchantType});

      yield put({
        type: 'name',
        payload: name,
      });
    },

    *fetchReview({ payload }, { call, put }) {
      const response = yield call(getMerchantReview, payload);

      yield put({
        type: 'review',
        payload: response,
      });
    },
    *fetchParent({ payload }, { call, put }) {
      const response = yield call(getParentMerchant, payload);

      yield put({
        type: 'parent',
        payload: response,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetailNameList, payload);

      yield put({
        type: 'detailList',
        payload: response,
      });

      if (callback) callback(response);
    },
    *getDetail({ payload }, { call, put }) {
      const merchant = yield call(getMerchant, payload);
      const response = yield call(getDetail, {detailName:merchant.managementContent,nameType:merchant.merchantType});

      yield put({
        type: 'detail',
        payload: response,
      });
    },
    *addReview({ payload, callback }, { call, put }) {
      const response = yield call(addReview, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMerchant, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call, put }) {
      const result = yield call(addMerchant, payload);
      if(result.status == 200){
        message.success('提交成功');
        yield put(routerRedux.push('/merchant/merchantOpen/list'));
      }else{
        message.error(result.message);
      }

    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMerchant, payload);
      yield put({
        type: 'move',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getSubBranch({ payload, callback }, { call, put }) {
      const response = yield call(getSubBranch, payload);
      yield put({
        type: 'subBranch',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.list,
        operator:action.payload.operator,
        inst:action.payload.inst
      };
    },
    move(state, action) {
      return {
        ...state,
      };
    },
    view(state, action) {
      return {
        ...state,
        view: action.payload.view,
        name:action.payload.name,
        citysList:action.payload.citysList,
        detail:action.payload.detail,
        parent:action.payload.parent,
        accountCitysList:action.payload.accountCitysList,
        bankList:action.payload.bankList,
        subBranch:action.payload.subBranch
      };
    },
    citysList(state, action) {
      return {
        ...state,
        citysList:action.payload,
      };
    },
    accountCitysList(state, action) {
      return {
        ...state,
        accountCitysList:action.payload,
      };
    },
    operator(state, action) {
      return {
        ...state,
        operator: action.payload,
      };
    },
    inst(state, action) {
      return {
        ...state,
        inst: action.payload,
      };
    },
    review(state, action) {
      return {
        ...state,
        review: action.payload,
      };
    },
    parent(state, action) {
      return {
        ...state,
        parent: action.payload,
      };
    },
    name(state, action) {
      return {
        ...state,
        name: action.payload,
      };
    },
    bank(state, action) {
      return {
        ...state,
        bankList: action.payload,
      };
    },
    detailList(state, action) {
      return {
        ...state,
        detailList: action.payload,
      };
    },
    detail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    subBranch(state, action) {
      return {
        ...state,
        subBranch: action.payload,
      };
    },
    clear() {
      return {
        data: {
          list: [],
          pagination: {},
        },
        view:{},
        operator:[],
        inst:[],
        review:[],
        parent:[],
        name:[],
        detail:{},
        detailList:[],
        citysList:[],
        accountCitysList:[],
        bankList:[]
      };
    },
  },
};
