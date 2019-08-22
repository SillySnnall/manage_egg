'use strict';

const Controller = require('egg').Controller;
const Config = require('../common/Config');
const Des = require('../common/Des');
const BodyData = require('../common/BodyData');

class IndexC extends Controller {
  async index() {
    // 获取提交的加密数据
    const signs = this.ctx.request.body.signs;
    // 获取操作用户的code
    const userCode = this.ctx.request.body.userCode;
    // 获取提交的时间戳
    const timestamps = this.ctx.request.body.timestamps;
    // 判空
    if (signs == null || signs == "" || signs == '{}' || timestamps == null || timestamps == "") {
      this.ctx.body = await this.clientMakeData(BodyData.failData("signs或timestamps为空"))
      return
    }
    // 解密
    const decrypt = Des.decrypt(signs, Config.key)
    const data = JSON.parse(decrypt);
    // const data = JSON.parse(signs);
    // 选择处理的业务
    const backData = await this.acSwitch(data, userCode)
    // 返回数据
    this.ctx.body = await this.clientMakeData(backData)
  }

  // ac接口业务选择
  async acSwitch(data, userCode) {
    switch (data.ac) {
      case "register": // 注册
        return await this.ctx.service.usersS.add(data.data, userCode);
      case "login": // 登陆
        return await this.ctx.service.usersS.login(data.data, userCode);

      case "addCustomer": // 添加客户
        return await this.ctx.service.customerS.add(data.data, userCode);
      case "updateCustomer": // 修改客户
        return await this.ctx.service.customerS.update(data.data, userCode);
      case "deleteCustomer": // 删除客户
        return await this.ctx.service.customerS.delete(data.data, userCode);
      case "findCustomer": // 查询客户
        return await this.ctx.service.customerS.find(data.data, userCode);

      case "addCommodity": // 添加商品
        return await this.ctx.service.commodityS.add(data.data, userCode);
      case "updateCommodity": // 修改商品
        return await this.ctx.service.commodityS.update(data.data, userCode);
      case "deleteCommodity": // 删除商品
        return await this.ctx.service.commodityS.delete(data.data, userCode);
      case "findCommodity": // 查询商品
        return await this.ctx.service.commodityS.find(data.data, userCode);

      case "addOrder": // 添加订单
        return await this.ctx.service.orderS.add(data.data, userCode);
      case "findOrder": // 查询订单
        return await this.ctx.service.orderS.find(data.data, userCode);
      case "deleteOrder": // 删除订单
        return await this.ctx.service.orderS.delete(data.data, userCode);
      case "updateOrder": // 修改订单
        return await this.ctx.service.orderS.update(data.data, userCode);
      case "findOrderItem": // 查询订单条目
        return await this.ctx.service.orderS.findOrderItem(data.data, userCode);
      case "stateChange": // 更改销售单状态
        return await this.ctx.service.orderS.stateChange(data.data, userCode);
      case "getPrintOrders": // 获取打印订单数据
        return await this.ctx.service.orderS.getPrintOrders(data.data, userCode);
      case "findDateOrder": // 按时间查询过账订单
        return await this.ctx.service.orderS.findDateOrder(data.data, userCode);


      case "addBackOrder": // 添加退货单
        return await this.ctx.service.backOrderS.add(data.data, userCode);
      case "findBackOrder": // 查询退货单
        return await this.ctx.service.backOrderS.find(data.data, userCode);
      case "deleteBackOrder": // 删除退货单
        return await this.ctx.service.backOrderS.delete(data.data, userCode);
      case "updateBackOrder": // 修改退货单
        return await this.ctx.service.backOrderS.update(data.data, userCode);
      case "findBackOrderItem": // 查询退货单条目
        return await this.ctx.service.backOrderS.findOrderItem(data.data, userCode);
      case "stateBackChange": // 更改退货单状态
        return await this.ctx.service.backOrderS.stateChange(data.data, userCode);
      case "getPrintBackOrders": // 获取打印退货单数据
        return await this.ctx.service.backOrderS.getPrintOrders(data.data, userCode);
      case "findBackDateOrder": // 按时间查询过账退货单
        return await this.ctx.service.backOrderS.findDateOrder(data.data, userCode);
    }
  }

  // 发送给客户端的数据组合
  async clientMakeData(noSigns) {
    return {
      signs: Des.encrypt(JSON.stringify(noSigns), Config.key),
      // signs: JSON.stringify(noSigns),
      timestamps: Date.now()
    }
  }
}

module.exports = IndexC;