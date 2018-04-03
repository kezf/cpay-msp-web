import { getInfoList } from '../services/api';

export default {
  namespace: 'home',

  state: {
    infoList: [],
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(getInfoList);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        infoList: action.payload,
      };
    },
  },
};
