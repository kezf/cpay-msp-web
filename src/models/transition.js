import { getFlow,getSummary,getPoundage } from '../services/api';

export default {
  namespace: 'transition',

  state: {
    flow:{
      data:{
        list:[],
        pagination:{}
      },
      count:{}
    },
    summary:{
      data:{
        list:[],
        pagination:{}
      },
      count:{}
    },
    poundage:{
      data:{
        list:[],
        pagination:{}
      },
      count:{}
    }
  },

  effects: {
    *fetchFlow({ payload }, { call, put }) {
      const response = yield call(getFlow, payload);
      yield put({
        type: 'queryFlow',
        payload: response,
      });
    },
    *fetchSummary({ payload }, { call, put }) {
      const response = yield call(getSummary, payload);
      yield put({
        type: 'querySummary',
        payload: response,
      });
    },
    *fetchPoundage({ payload }, { call, put }) {
      const response = yield call(getPoundage, payload);
      yield put({
        type: 'queryPoundage',
        payload: response,
      });
    },
  },

  reducers: {
    queryFlow(state, action) {
      return {
        ...state,
        flow: action.payload,
      };
    },
    querySummary(state, action) {
      return {
        ...state,
        summary: action.payload,
      };
    },
    queryPoundage(state, action) {
      return {
        ...state,
        poundage: action.payload,
      };
    },
  },
};
