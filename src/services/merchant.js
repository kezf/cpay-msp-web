import { getMerchantOpenList, getOperatorList, getInstList} from './api';

export async function fetchMerchantOpenList(params) {
  const list = getMerchantOpenList(params);
  const operator = getOperatorList();
  const inst = getInstList();
  return {
    list:list,
    operator:operator,
    inst:inst
  };
}
