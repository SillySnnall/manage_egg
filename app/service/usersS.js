const Service = require('egg').Service;

const BodyData = require('../common/BodyData');
const Util = require('../common/Util');
class UsersS extends Service {
  // 注册用户
  async add(data, userCode) {
    // 空判断
    if (data.name == null || data.name === "") {
      return BodyData.failData("姓名为空")
    }
    if (data.phone == null || data.phone === "") {
      return BodyData.failData("手机号为空")
    }
    if (data.username == null || data.username === "") {
      return BodyData.failData("用户账号为空")
    }
    if (data.password == null || data.password === "") {
      return BodyData.failData("用户密码为空")
    }
    // 查询此用户是否已注册
    var users = await this.app.mysql.get('users', {
      username: data.username
    });
    if (users != null) {
      return BodyData.failData("用户已注册");
    }
    // 组合数据
    users = {
      code: Util.uuidCode(),
      name: data.name,
      phone: data.phone,
      username: data.username,
      password: data.password,
      authority: '00000000000000000000000000000000',
      create_time: Date.now()
    }
    // 数据库插入数据
    const result = await this.app.mysql.insert('users', users);
    // 判断是否插入成功
    if (result.affectedRows == 0) {
      return BodyData.failData("注册失败");
    }
    // 删除返回数据中的password字段
    delete users.username
    delete users.password
    this.app.logger.info('[登录用户]:' + userCode + '[UsersS.add]:' + JSON.stringify(users));
    return BodyData.successData(users);
  }


  // 删除客户
  async login(data, userCode) {
    // 查询此用户是否存在
    const users = await this.app.mysql.get('users', {
      username: data.username,
      password: data.password,
    });
    if (users == null) {
      return BodyData.failData("账号密码错误");
    }
    // 删除返回数据中的id、username、password字段
    delete users.id
    delete users.username
    delete users.password
    this.app.logger.info('[登录用户]:' + userCode + '[UsersS.login]:' + JSON.stringify(users));
    return BodyData.successData(users);
  }

}
module.exports = UsersS;

// CREATE TABLE `users` (
//   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
//   `code` varchar(45) NOT NULL COMMENT '用户编码',
//   `name` varchar(11) NOT NULL COMMENT '用户名称',
//   `phone` varchar(11) NOT NULL COMMENT '用户手机号',
//   `username` varchar(18) NOT NULL COMMENT '用户账号',
//   `password` varchar(18) NOT NULL COMMENT '用户密码',
//   `authority` varchar(32) NOT NULL COMMENT '用户权限(1位为一个功能)',
//   `create_time` varchar(13) NOT NULL COMMENT '创建时间',
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;


// authority 权限定义
//01 0 (admin权限：0没有，1有)
//02 0 (商品和客户修改权限：0没有，1有)
//03 0 (商品和客户删除权限：0没有，1有)
//04 0 (商品和客户新增权限：0没有，1有)
//05 0 
//06 0 
//07 0 
//08 0
//09 0
//10 0
//11 0
//12 0
//13 0
//14 0
//15 0
//16 0