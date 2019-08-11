const Service = require('egg').Service;

const BodyData = require('../common/BodyData');
const Util = require('../common/Util');
class CustomerS extends Service {
  // 添加客户
  async add(data, userCode) {
    // 空判断
    if (data.shop == null || data.shop === "") {
      return BodyData.failData("商店名字为空")
    }
    // 组合数据
    const customer = {
      code: Util.uuidCode(),
      shop: data.shop,
      name: data.name,
      phone: data.phone,
      region: data.region,
      create_time: Date.now()
    }
    // 数据库插入数据
    const result = await this.app.mysql.insert('customer', customer);
    // 判断是否插入成功
    if (result.affectedRows == 0) {
      return BodyData.failData("添加失败");
    }
    this.app.logger.info('[登录用户]:' + userCode + '[CustomerS.add]:' + JSON.stringify(customer));
    return BodyData.successData(customer);
  }

  // 修改客户
  async update(data, userCode) {
    // 初始化事务
    const conn = await this.app.mysql.beginTransaction();
    try {
      // 空判断
      if (data.shop == null || data.shop === "") {
        throw "商店名字为空"
      }
      // 查询此客户是否存在
      const customer = await conn.get('customer', {
        code: data.code
      });
      if (customer == null) {
        throw "客户不存在";
      }
      // 赋值数据
      customer.shop = data.shop
      customer.name = data.name
      customer.phone = data.phone
      customer.region = data.region

      // 数据库修改数据
      var result = await conn.update('customer', customer);
      // 判断是否修改成功
      if (result.affectedRows == 0) {
        throw "修改失败"
      }
      // 更新订单中的商店名字
      result = await conn.update('orders', {
        shop: data.shop,
      }, {
        where: {
          customer_code: data.code
        }
      });
      await conn.commit(); // 提交事务
      // 删除返回数据中的id字段
      delete customer.id
      this.app.logger.info('[登录用户]:' + userCode + '[CustomerS.update]:' + JSON.stringify(customer));
      return BodyData.successData(customer);
    } catch (err) {
      this.app.logger.error(err);
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      if ((err).constructor !== String) {
        err = "异常，添加失败"
      }
      return BodyData.failData(err);
    }
  }

  // 删除客户
  async delete(data, userCode) {
    // 查询此客户是否存在
    const customer = await this.app.mysql.get('customer', {
      code: data.code
    });
    if (customer == null) {
      return BodyData.failData("客户不存在");
    }
    // 数据库删除数据
    const result = await this.app.mysql.delete('customer', customer);
    // 判断是否删除成功
    if (result.affectedRows == 0) {
      return BodyData.failData("删除失败");
    }
    this.app.logger.info('[登录用户]:' + userCode + '[CustomerS.delete]:' + JSON.stringify(customer));
    return BodyData.successData("删除成功");
  }

  // 查询客户
  async find(data, userCode) {
    // 组合查询数据
    var customerList = []
    const offset = Number(data.offset) * Number(data.limit)
    if (data.searchText == null || data.searchText == '') {
      customerList = await this.app.mysql.select('customer', { // 搜索 post 表
        orders: [
          ['create_time', 'desc']
        ], // 排序方式
        offset: Number(offset), // 数据偏移量
        limit: Number(data.limit) // 返回数据量
      });
    } else {
      // 条件，模糊，排序 查询
      customerList = await this.app.mysql.query(
        "select * from customer where " + data.searchType + " like '%" + data.searchText + "%' ORDER BY 'create_time' DESC LIMIT " + Number(offset) + "," + Number(data.limit)
      )
    }
    this.app.logger.info('[登录用户]:' + userCode + '[CustomerS.find]:' + JSON.stringify(customerList));
    return BodyData.successData(customerList);
  }

}
module.exports = CustomerS;

// CREATE TABLE `customer` (
//   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
//   `code` varchar(45) NOT NULL COMMENT '客户编码',
//   `shop` varchar(255) NOT NULL COMMENT '商店名称',
//   `name` varchar(11) NOT NULL COMMENT '客户名称',
//   `phone` varchar(11) NOT NULL COMMENT '电话号码',
//   `region` varchar(11) NOT NULL COMMENT '地区',
//   `create_time` varchar(13) NOT NULL COMMENT '创建时间',
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;