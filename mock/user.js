import { getUrlParams } from './utils'
import { hex_md5 } from './md5'

const users = [{
  name: 'admin',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  userid: 1,
  notifyCount: 12,
  currentAuthority: 'admin',
  password: '21218cca77804d2ba1922c33e0151105'
},{
  name: 'user',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  userid: 2,
  notifyCount: 12,
  currentAuthority: 'user',
  password: 'e10adc3949ba59abbe56e057f20f883e'
}];


export function login(req, res){
  const { password, userName, type } = req.body;

  const user = users.filter((val) => val.name === userName && val.password === hex_md5(password));
  if(!user.length){
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
    return;
  }

  res.send({
    status: 'ok',
    user:{
      name:user[0].name,
      avatar:user[0].avatar,
      userid:user[0].userid,
      notifyCount:user[0].notifyCount
    },
    type,
    currentAuthority:user[0].currentAuthority
  });

}

export function getUser(userid){

  return users.filter((val) => parseInt(val.userid,10) === parseInt(userid,10))[0];


}

export default {
  login
};
