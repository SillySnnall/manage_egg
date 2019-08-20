const Service = require('egg').Service;

const BodyData = require('../common/BodyData');
const Util = require('../common/Util');
class CommodityS extends Service {
  // 添加商品
  async add(data, userCode) {
    // 空判断
    if (data.name == null || data.name === "") {
      return BodyData.failData("商品名称为空")
    }
    if (data.weight == null || data.weight === "") {
      return BodyData.failData("商品型号为空")
    }
    if (data.specifications == null || data.specifications === 0) {
      return BodyData.failData("商品规格为空")
    }
    if (data.home == null || data.home === "") {
      return BodyData.failData("出产地为空")
    }
    if (data.bar_code == null || data.bar_code === "") {
      return BodyData.failData("条形码为空")
    }
    if (data.expire == null || data.expire === 0) {
      return BodyData.failData("保质期为空")
    }
    if (data.price_in == null || data.price_in === "0.00") {
      return BodyData.failData("进货价格为空")
    }
    if (data.price_out == null || data.price_out === "0.00") {
      return BodyData.failData("正发价格为空")
    }
    if (data.price_out_down == null || data.price_out_down === "0.00") {
      return BodyData.failData("批发价格为空")
    }
    if (data.stock == null || data.stock < 0) {
      throw "库存为空"
    }
    // 查询条码是否重复
    var result = await this.app.mysql.get('commodity', {
      bar_code: data.bar_code
    });
    if (result != null) {
      return BodyData.failData("条码重复");
    }
    // 组合数据
    const commodity = {
      code: Util.uuidCode(),
      name: data.name,
      weight: data.weight,
      specifications: data.specifications,
      home: data.home,
      bar_code: data.bar_code,
      expire: data.expire,
      price_in: data.price_in,
      price_out: data.price_out,
      price_out_down: data.price_out_down,
      img_url: data.img_url,
      stock: data.stock,
      create_time: Date.now(),
      is_del: 0
    }
    // 数据库插入数据
    result = await this.app.mysql.insert('commodity', commodity);
    // 判断是否插入成功
    if (result.affectedRows == 0) {
      return BodyData.failData("添加失败");
    }
    this.app.logger.info('[登录用户]:' + userCode + '[CommodityS.add]:' + JSON.stringify(commodity));
    return BodyData.successData(commodity);
  }

  // 修改商品
  async update(data, userCode) {
    // 初始化事务
    const conn = await this.app.mysql.beginTransaction();
    try {
      // 空判断
      if (data.name == null || data.name === "") {
        throw "商品名称为空"
      }
      if (data.weight == null || data.weight === "") {
        throw "商品型号为空"
      }
      if (data.specifications == null || data.specifications === 0) {
        throw "商品规格为空"
      }
      if (data.home == null || data.home === "") {
        throw "出产地为空"
      }
      if (data.bar_code == null || data.bar_code === "") {
        throw "条形码为空"
      }
      if (data.expire == null || data.expire === 0) {
        throw "保质期为空"
      }
      if (data.price_in == null || data.price_in === "0.00") {
        throw "进货价格为空"
      }
      if (data.price_out == null || data.price_out === "0.00") {
        throw "正发价格为空"
      }
      if (data.price_out_down == null || data.price_out_down === "0.00") {
        throw "批发价格为空"
      }
      if (data.stock == null || data.stock < 0) {
        throw "库存为空"
      }
      // 查询此客户是否存在
      const commodity = await conn.get('commodity', {
        code: data.code
      });
      if (commodity == null) {
        throw "商品不存在"
      }
      // 赋值数据
      commodity.name = data.name
      commodity.weight = data.weight
      commodity.specifications = data.specifications
      commodity.home = data.home
      commodity.expire = data.expire
      commodity.price_in = data.price_in
      commodity.price_out = data.price_out
      commodity.img_url = data.img_url
      commodity.price_out_down = data.price_out_down
      commodity.stock = data.stock
      commodity.is_del = data.is_del
      // 数据库修改数据
      var result = await conn.update('commodity', commodity);
      // 判断是否修改成功
      if (result.affectedRows == 0) {
        throw "修改失败"
      }
      // 更新订单中的商店名字
      result = await conn.update('order_item', {
        name: data.name,
      }, {
        where: {
          commodity_code: data.code
        }
      });
      await conn.commit(); // 提交事务
      // 删除返回数据中的id字段
      delete commodity.id
      this.app.logger.info('[登录用户]:' + userCode + '[CommodityS.update]:' + JSON.stringify(commodity));
      return BodyData.successData(commodity);
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

  // 删除商品
  async delete(data, userCode) {
    // 查询此客户是否存在
    const commodity = await this.app.mysql.get('commodity', {
      code: data.code
    });
    if (commodity == null) {
      return BodyData.failData("客户不存在");
    }
    // 数据库删除更改删除字段
    commodity.is_del = 1;
    const result = await this.app.mysql.update('commodity', commodity);
    // 判断是否删除成功
    if (result.affectedRows == 0) {
      return BodyData.failData("删除失败");
    }
    this.app.logger.info('[登录用户]:' + userCode + '[CommodityS.delete]:' + JSON.stringify(commodity));
    return BodyData.successData("删除成功");
  }

  // 查询商品
  async find(data, userCode) {
    // 组合查询数据
    var commodityList = []
    const offset = Number(data.offset) * Number(data.limit)
    if (data.searchText == null || data.searchText == '') {
      commodityList = await this.app.mysql.select('commodity', { // 搜索 post 表
        where: {
          is_del: 0
        }, // WHERE 条件
        orders: [
          ['create_time', 'desc']
        ], // 排序方式
        offset: Number(offset), // 数据偏移量
        limit: Number(data.limit) // 返回数据量
      });
    } else {
      // 条件，模糊，排序 查询
      commodityList = await this.app.mysql.query(
        "select * from commodity where is_del = 0 and " + data.searchType + " like '%" + data.searchText + "%' ORDER BY 'create_time' DESC LIMIT " + Number(offset) + "," + Number(data.limit)
      )
    }
    this.app.logger.info('[登录用户]:' + userCode + '[CommodityS.find]:' + JSON.stringify(commodityList));
    return BodyData.successData(commodityList);
  }

}
module.exports = CommodityS;

// CREATE TABLE `commodity` (
//   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
//   `code` varchar(45) NOT NULL COMMENT '商品编码',
//   `name` varchar(255) NOT NULL COMMENT '商品名称',
//   `weight` varchar(8) NOT NULL COMMENT '商品型号（g，kg，mL，L）',
//   `specifications` int(11) NOT NULL COMMENT '商品规格（一件有几个）',
//   `home` varchar(11) NOT NULL COMMENT '出产地',
//   `bar_code` varchar(15) NOT NULL COMMENT '条形码',
//   `expire` int(11) NOT NULL COMMENT '保质期',
//   `price_in` varchar(20) NOT NULL COMMENT '进货价格',
//   `price_out` varchar(20) NOT NULL COMMENT '正发价格',
//   `price_out_down` varchar(20) NOT NULL COMMENT '批发价格',
//   `img_url` varchar(255) NOT NULL COMMENT '商品图片',
//   `create_time` varchar(13) NOT NULL COMMENT '创建时间',
//   `stock` int(11) NOT NULL COMMENT '库存',
//   `is_del` int(2) NOT NULL COMMENT '是否删除了（0未删除，1已删除）',
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;