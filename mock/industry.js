import { getUrlParams } from './utils';

const nameList = [{type:3,name:'电商/团购',	detailName:'线上商超',mcc:	203},
  {type:3,name:'电商/团购',	detailName:'团购',mcc:2},
  {type:3,name:'电商/团购',	detailName:'海淘',	mcc:3},
  {type:3,name:'线下零售',	detailName:'超市',	mcc:204},
  {type:3,name:'线下零售',	detailName:'便利店',	mcc:205},
  {type:3,name:'线下零售',	detailName:'自动贩卖机',mcc:206},
  {type:3,name:'线下零售',	detailName:'百货',mcc:207},
  {type:3,name:'线下零售',	detailName:'其他综合零售',mcc:208},
  {type:3,name:'生活/家居',detailName:'户外/运动/健身器材/安防',mcc:6},
  {type:3,name:'生活/家居',detailName:'黄金珠宝/钻石/玉石',mcc:9},
  {type:3,name:'生活/家居',detailName:'母婴用品/儿童玩具',mcc:19},
  {type:3,name:'生活/家居',detailName:'家装建材/家居家纺',mcc:266},
  {type:3,name:'生活/家居',detailName:'美妆/护肤',mcc:267},
  {type:3,name:'生活/家居',detailName:'鲜花/盆栽/室内装饰品',mcc:268},
  {type:3,name:'生活/家居',detailName:'交通工具/配件/改装',mcc:269},
  {type:3,name:'生活/家居',detailName:'服饰/箱包/饰品',mcc:271},
  {type:3,name:'生活/家居',detailName:'钟表/眼镜',mcc:	272},
  {type:3,name:'生活/家居',detailName:'宠物/宠物食品/饲料',mcc:	284},
  {type:3,name:'生活/家居',detailName:'数码家电/办公设备',mcc:310},
  {type:3,name:'生活/家居',detailName:'书籍/音像/文具/乐器',mcc:315},
  {type:3,name:'生活/家居',detailName:'计生用品',mcc:13},
  {type:3,name:'餐饮/食品',detailName:'食品',mcc:270},
  {type:3,name:'餐饮/食品',detailName:'餐饮',mcc:90},
  {type:3,name:'生活/咨询服务',detailName:'婚庆/摄影',mcc:273},
  {type:3,name:'生活/咨询服务',detailName:'装饰/设计',mcc:289},
  {type:3,name:'生活/咨询服务',detailName:'家政/维修服务',mcc:311},
  {type:3,name:'生活/咨询服务',detailName:'广告/会展/活动策划',mcc:312},
  {type:3,name:'生活/咨询服务',detailName:'咨询/法律咨询/金融询等	',mcc:42},
  {type:3,name:'生活/咨询服务',detailName:'人才中介机构/招聘/猎头',mcc:	93},
  {type:3,name:'生活/咨询服务',detailName:'职业社交/婚介/交友',mcc:94},
  {type:3,name:'生活/咨询服务',detailName:'网上生活服务平台',mcc:95},
  {type:3,name:'票务/旅游',detailName:'机票/机票代理',mcc:274},
  {type:3,name:'票务/旅游',detailName:'旅馆/酒店/度假区',mcc:275},
  {type:3,name:'票务/旅游',detailName:'娱乐票务',mcc:281},
  {type:3,name:'票务/旅游',detailName:'交通票务',mcc:283},
  {type:3,name:'票务/旅游',detailName:'景区/宗教',mcc:313},
  {type:3,name:'票务/旅游',detailName:'旅行社',mcc:23},
  {type:3,name:'票务/旅游',detailName:'旅游服务平台',mcc:24},
  {type:3,name:'网络虚拟服务',detailName:'在线图书/视频/音乐',mcc:276},
  {type:3,name:'网络虚拟服务',detailName:'软件/建站/技术开发',mcc:277},
  {type:3,name:'网络虚拟服务',detailName:'网络推广/网络广告',mcc:278},
  {type:3,name:'网络虚拟服务',detailName:'游戏',mcc:279},
  {type:3,name:'网络虚拟服务',detailName:'门户/资讯/论坛',mcc:104},
  {type:3,name:'教育/培训',detailName:'	教育/培训/考试缴费/学费',mcc:52},
  {type:3,name:'教育/培训	',detailName:'私立院校',mcc:53},
  {type:3,name:'娱乐/健身服务',detailName:'俱乐部/休闲会所',mcc:280},
  {type:3,name:'娱乐/健身服务',detailName:'美容/健身类会所',mcc:54},
  {type:3,name:'娱乐/健身服务',detailName:'游艺厅/KTV/网吧',mcc:56},
  {type:3,name:'房地产',detailName:'房地产',mcc:316},
  {type:3,name:'医疗',detailName:'保健信息咨询平台',mcc:282},
  {type:3,name:'医疗',detailName:'保健器械/医疗器械/非处方药品',mcc:314},
  {type:3,name:'医疗',detailName:'私立/民营医院/诊所',mcc:66},
  {type:3,name:'医疗',detailName:'挂号平台',mcc:67},
  {type:3,name:'收藏/拍卖',detailName:'	文物经营/文物复制品销售',mcc:285},
  {type:3,name:'收藏/拍卖',detailName:'	拍卖/典当',mcc:325},
  {type:3,name:'收藏/拍卖',detailName:'	非文物类收藏品',mcc:31},
  {type:3,name:'苗木/绿化',detailName:'	苗木种植/园林绿化',mcc:317},
  {type:3,name:'苗木/绿化',detailName:'	化肥/农用药剂等',mcc:40},
  {type:3,name:'交通运输服务类',detailName:'	物流/快递公司',mcc:70},
  {type:3,name:'交通运输服务类',detailName:'	加油',mcc:259},
  {type:3,name:'交通运输服务类',detailName:'	港口经营港口理货',mcc:75},
  {type:3,name:'交通运输服务类',detailName:'	租车',mcc:77},
  {type:3,name:'生活缴费',detailName:'水电煤缴费/交通罚款等生活缴费',mcc:57},
  {type:3,name:'生活缴费',detailName:'停车缴费',mcc:287},
  {type:3,name:'生活缴费',detailName:'城市交通/高速收费',mcc:288},
  {type:3,name:'生活缴费',detailName:'有线电视缴费',mcc:58},
  {type:3,name:'生活缴费',detailName:'物业管理费',mcc:60},
  {type:3,name:'生活缴费',detailName:'其他生活缴费',mcc:62},
  {type:3,name:'公益',detailName:'公益',mcc:103},
  {type:3,name:'通信',detailName:'电信运营商',mcc:80},
  {type:3,name:'通信',detailName:'宽带收费',mcc:81},
  {type:3,name:'通信',detailName:'话费通讯',mcc:92},
  {type:3,name:'金融',detailName:'众筹',mcc:112},
  {type:3,name:'金融',detailName:'保险业务',mcc:318},
  {type:3,name:'金融',detailName:'财经资讯',mcc:96},
  {type:3,name:'金融',detailName:'股票软件类',mcc:97},
  {type:3,name:'其他',detailName:'其他行业',mcc:111},
  {type:1,name:'餐饮/食品',detailName:'食品',mcc:292},
  {type:1,name:'餐饮/食品',detailName:'餐饮',mcc:153},
  {type:1,name:'线下零售',	detailName:'便利店',mcc:209},
  {type:1,name:'线下零售',	detailName:'其他综合零售',mcc:210},
  {type:1,name:'生活/家居',detailName:'户外/运动/健身器材/安防',mcc:116},
  {type:1,name:'生活/家居',detailName:'母婴用品/儿童玩具',mcc:129},
  {type:1,name:'生活/家居',detailName:'家装建材/家居家纺',mcc:293},
  {type:1,name:'生活/家居',detailName:'美妆/护肤',mcc:294},
  {type:1,name:'生活/家居',detailName:'鲜花/盆栽/室内装饰品',mcc:295},
  {type:1,name:'生活/家居',detailName:'交通工具/配件/改装',mcc:296},
  {type:1,name:'生活/家居',detailName:'服饰/箱包/饰品',mcc:297},
  {type:1,name:'生活/家居',detailName:'钟表/眼镜',mcc:298},
  {type:1,name:'生活/家居',detailName:'宠物/宠物食品/饲料',mcc:305},
  {type:1,name:'生活/家居',detailName:'数码家电/办公设备',mcc:319},
  {type:1,name:'生活/家居',detailName:'书籍/音像/文具/乐器',mcc:323},
  {type:1,name:'生活/家居',detailName:'计生用品',mcc:123},
  {type:1,name:'生活/咨询服务',detailName:'婚庆/摄影',mcc:299},
  {type:1,name:'生活/咨询服务',detailName:'装饰/设计',mcc:306},
  {type:1,name:'生活/咨询服务',detailName:'家政/维修服务',mcc:320},
  {type:1,name:'生活/咨询服务',detailName:'广告/会展/活动策划',mcc:321},
  {type:1,name:'生活/咨询服务',detailName:'咨询/法律咨询/金融询等',mcc:143},
  {type:1,name:'生活/咨询服务',detailName:'职业社交/婚介/交友',mcc:157},
  {type:1,name:'娱乐/健身服务',detailName:'俱乐部/休闲会所',mcc:300},
  {type:1,name:'娱乐/健身服务',detailName:'美容/健身类会所',mcc:148},
  {type:1,name:'娱乐/健身服务',detailName:'游艺厅/KTV/网吧',mcc:149},
  {type:1,name:'票务/旅游',detailName:'旅馆/酒店/度假区',mcc:301},
  {type:1,name:'票务/旅游',detailName:'娱乐票务',mcc:307},
  {type:1,name:'票务/旅游',detailName:'交通票务',mcc:308},
  {type:1,name:'网络虚拟服务',detailName:'软件/建站/技术开发',mcc:302},
  {type:1,name:'网络虚拟服务',detailName:'网络推广/网络广告',mcc:303},
  {type:1,name:'网络虚拟服务',detailName:'游戏',mcc:304},
  {type:1,name:'教育/培训	',detailName:'教育/培训/考试缴费/学费',mcc:147},
  {type:1,name:'医疗',detailName:'私立/民营医院/诊所',mcc:230},
  {type:1,name:'医疗',detailName:'保健器械/医疗器械/非处方药品',mcc:322},
  {type:1,name:'苗木/绿化',detailName:'	苗木种植/园林绿化',mcc:324},
  {type:1,name:'通信',detailName:'话费通讯',mcc:155},
  {type:1,name:'生活缴费',detailName:'生活缴费',mcc:309},
  {type:1,name:'金融',detailName:'财经资讯',mcc:242},
  {type:1,name:'其他',detailName:'其他行业',mcc:158},
  {type:2,name:'医疗',detailName:'公立医院',mcc:176},
  {type:2,name:'医疗',detailName:'挂号平台',mcc:177},
  {type:2,name:'教育/培训',detailName:'公立院校',mcc:164},
  {type:2,name:'其他生活缴费',detailName:'水电煤缴费/交通罚款等生活缴费',mcc:165},
  {type:2,name:'其他生活缴费',detailName:'事业单位:',mcc:167},
  {type:2,name:'其他生活缴费',detailName:'停车缴费',mcc:290},
  {type:2,name:'其他生活缴费',detailName:'城市交通/高速收费',mcc:291},
  {type:2,name:'其他生活缴费',detailName:'物业管理费',mcc:170},
  {type:2,name:'其他生活缴费',detailName:'其他生活缴费',mcc:172}];

export function getNameListFn(params){
  let list = nameList.filter(data => data.type === Number(params.nameType));

  let result = [];
  list.map((data) => {
    const le = result.filter(re => re.label === data.name).length;
    if(!le){
      result.push({label:data.name,value:data.name,isLeaf: false,});
    }
  });

  return result;
}

export function getNameList(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  const result = getNameListFn(params);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getDetailNameListFn(params){
  let list = nameList.filter(data => data.type === Number(params.nameType));
  let result = list.filter(data => data.name === params.name);

  result = result.map((data) => {return {label:data.detailName,value:data.detailName}});

  return result;
}

export function getDetailNameList(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  const result = getDetailNameListFn(params);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function getDetailFn(params){
  let list = nameList.filter(data => data.type === Number(params.nameType));
  let result = list.filter(data => data.detailName === params.detailName)[0];


  return result?result:{};
}


export function getDetail(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  let list = nameList.filter(data => data.type === Number(params.nameType));
  let result = list.filter(data => data.detailName === params.detailName)[0];


  if (res && res.json) {
    res.json(result?result:{});
  } else {
    return result?result:{};
  }
}

export default {
  getNameList,
  getDetailNameList,
  getDetail
};
